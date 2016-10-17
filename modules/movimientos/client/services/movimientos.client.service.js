//Movimiento service used to communicate Movimiento REST endpoints
(function () {
  'use strict';

  var movimientoModel = angular.module('movimientos');
    movimientoModel.factory('MovimientoService', MovimientoService);

  MovimientoService.$inject = ['$resource'];

  function MovimientoService($resource) {
    return $resource('api/movimientos/:movimientoId', {
      movimientoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


movimientoModel.service('MovimientoRestServices',  ['$q', '$http', '$timeout', 'MovimientoService', 'Authentication', '$rootScope', function($q, $http, $timeout, MovimientoService, Authentication, $rootScope){
    var self ={
     'movimiento': {},
     'tempAncestors': [],
     'movimientoList': [],
     'listSalePromotion': [],
     'tempSelectedSale': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'movimientoCompleteOrder': false,
     'saveMode': '',
     'printMode': false,
     'provider': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'counter': 5,
     'count': 25,
     'ordering': null,
     'startDate': new Date(moment().subtract(1, 'months').endOf('month').format('MM/DD/YYYY')),
     'endDate': new Date(),
     'isSaving': false,
     'movimientoStatus': null,
     'formaPago': null,
     'selectedProduct': null,
     'selectedCustomer': null,
     'isLoading': false,
     'carList': [],
     'loadMovimiento': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.movimientoStatus ? self.movimientoStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        MovimientoService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.movimientoList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.movimientoList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadMovimiento();
     },
    'getSaleFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/SaleFilter', data)
      .success(function(response) {
        angular.forEach(response, function(card) {
          result.push(card);
        });
        return deferred.resolve(result);
      })
      .error(function(){
        /* error handling */
      });
      return deferred.promise;
    },'getMovList': function(val){
     var data = {
       status: val.status,
       session : val.session
     };
     var result = [];
     var defer =  $q.defer();

     $http.post('/api/movList', data)
     .success(function(response) {
      angular.forEach(response, function(card) {
        result.push(card);
      });
       defer.resolve(result);
   });
     return defer.promise;
   },'getMaxSale': function(val){
      var data = {
       sucursalId: val
     };
     var result = [];
     var deferred =  $q.defer();

     $http.post('/api/getMaxInventario', data)
     .success(function(response) {
      angular.forEach(response, function(card) {
        result.push(card);
      });
      return deferred.resolve(result);
    })
     .error(function(){
      /* error handling */
    });
     return deferred.promise;
   },
   'update': function(param){
    var defer = $q.defer();
    self.isSaving = true;
    var Sale = new MovimientoService(param);
    Sale.$update(function(data){
      self.Sale = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },
  'create': function(movimiento){
    var defer = $q.defer();
    self.isSaving = true;
    var Sale = new MovimientoService(movimiento);
    Sale.$save(function(data){
     defer.resolve(data);
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },'delete': function(Sale){
    var defer = $q.defer();
    self.isSaving = true;
    var SaleDelete = new MovimientoService({ _id : Sale._id});
    SaleDelete.$remove(function(data){
     self.Sale = {};
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },
  'doOrder': function(order){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.cars = [];
    self.ordering = order;
    self.count = 25;
    self.loadcars();
  },
  'doSearch': function(search){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadMovimiento();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.movimientoStatus = status;
     if(status !== 'PENDIENTE'){
      self.movimientoCompleteOrder = true;
     }
     self.doSearch();
  },'watchFilters': function () {
      $rootScope.$watch(function () {
        return self.provider;
      }, function (newVal) {

        if (angular.isDefined(newVal)) {
           self.doSearch();
        }
      });

      $rootScope.$watch(function(){
        return self.endDate;
      }, function(newVal){
          if(angular.isDefined(newVal)){
             self.doSearch();
          }
      });

      $rootScope.$watch(function(){
         return self.startDate;
      }, function(newVal){
        if(angular.isDefined(newVal)){
          self.doSearch();
        }
      });
    }
};
// self.watchFilters();
self.loadSucursal();
self.loadMovimiento();

return self;
}]);


})();
