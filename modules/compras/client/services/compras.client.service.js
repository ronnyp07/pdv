//Compras service used to communicate Compras REST endpoints
(function () {
  'use strict';

  var compraModel = angular.module('compras');
  compraModel.factory('ComprasService', ComprasService);
  ComprasService.$inject = ['$resource'];
  function ComprasService($resource) {
    return $resource('api/compras/:compraId', {
      compraId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  compraModel.service('ComprasRestServices',  ['$q', '$http', '$timeout', 'ComprasService', 'Authentication', '$rootScope', function($q, $http, $timeout, ComprasService, Authentication, $rootScope){
    var self ={
     'compras': {},
     'tempAncestors': [],
     'comprasList': [],
     'listCompraPromotion': [],
     'tempSelectedCompra': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'compraCompleteOrder': false,
     'saveMode': '',
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
     'compraStatus': null,
     'isLoading': false,
     'carList': [],
     'loadCompras': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.compraStatus ? self.compraStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        ComprasService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.comprasList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.comprasList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadproducts();
     },
    'getCompraFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/CompraFilter', data)
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
    },'getMaxCompra': function(val){
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
    var Compra = new ComprasService(param);
    Compra.$update(function(data){
      self.Compra = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },
  'create': function(compra){
    var defer = $q.defer();
    self.isSaving = true;
    var Compra = new ComprasService(compra);

    Compra.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },
  'delete': function(Compra){
    var defer = $q.defer();
    self.isSaving = true;
    var CompraDelete = new ComprasService({ _id : Compra._id});
    CompraDelete.$remove(function(data){
     self.Compra = {};
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
    self.loadCompras();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.compraStatus = status;
     if(status !== 'PENDIENTE'){
      self.compraCompleteOrder = true;
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
self.loadCompras();

return self;
}]);
})();
