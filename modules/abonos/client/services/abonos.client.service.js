//Abonos service used to communicate Abonos REST endpoints
(function () {
  'use strict';

  var abonosModel = angular.module('abonos');
    abonosModel.factory('AbonosService', AbonosService);

  AbonosService.$inject = ['$resource'];

  function AbonosService($resource) {
    return $resource('api/abonos/:abonoId', {
      abonoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


abonosModel.service('AbonosRestServices',  ['$q', '$http', '$timeout', 'AbonosService', 'Authentication', '$rootScope', function($q, $http, $timeout, AbonosService, Authentication, $rootScope){
    var self ={
     'abonos': {},
     'tempAncestors': [],
     'abonosList': [],
     'listSalePromotion': [],
     'tempSelectedSale': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'abonoCompleteOrder': false,
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
     'abonoStatus': null,
     'formaPago': null,
     'selectedProduct': null,
     'selectedCustomer': null,
     'isLoading': false,
     'carList': [],
     'loadAbonos': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.abonoStatus ? self.abonoStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        AbonosService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.abonosList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.abonosList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadAbonos();
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
    var Sale = new AbonosService(param);
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
  'create': function(abono){
    var defer = $q.defer();
    self.isSaving = true;
    var Sale = new AbonosService(abono);
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
    var SaleDelete = new AbonosService({ _id : Sale._id});
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
    self.loadAbonos();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.abonoStatus = status;
     if(status !== 'PENDIENTE'){
      self.abonoCompleteOrder = true;
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
self.loadAbonos();

return self;
}]);


})();
