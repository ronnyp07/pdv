//Sucursals service used to communicate Sucursals REST endpoints
(function () {
  'use strict';

  var sucursalModel = angular.module('sucursals');
  sucursalModel.factory('SucursalsService', SucursalsService);
  SucursalsService.$inject = ['$resource'];
  function SucursalsService($resource) {
    return $resource('api/sucursals/:sucursalId', {
      sucursalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  sucursalModel.factory('SucursalListServices', SucursalListServices);
  SucursalListServices.$inject = ['$resource'];
  function SucursalListServices($resource) {
    return $resource('/api/sucursalList',
     {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  sucursalModel.service('SucursalsRestServices',  ['$q', '$http', '$timeout', 'SucursalsService', 'Authentication', '$rootScope', 'Security', '$state', function($q, $http, $timeout, SucursalsService, Authentication, $rootScope, Security, $state){
    var self ={
     'sucursals': {},
     'tempAncestors': [],
     'sucursalsList': [],
     'listSucursalPromotion': [],
     'tempSelectedSucursal': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'sucursalCompleteOrder': false,
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
     'sucursalStatus': null,
     'isLoading': false,
     'carList': [],
     'loadSucursals': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        SucursalsService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.sucursalsList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.sucursalsList.push(item);
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
     },'getSucursalFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/SucursalFilter', data)
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
    },'getMaxSucursal': function(val){
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
    var Sucursal = new SucursalsService(param);
    Sucursal.$update(function(data){
      self.Sucursal = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },'create': function(sucursal){
    var defer = $q.defer();
    self.isSaving = true;
    var Sucursal = new SucursalsService(sucursal);

    Sucursal.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },'delete': function(Sucursal){
    var defer = $q.defer();
    self.isSaving = true;
    var SucursalDelete = new SucursalsService({ _id : Sucursal._id});
    SucursalDelete.$remove(function(data){
     self.Sucursal = {};
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },'doOrder': function(order){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.cars = [];
    self.ordering = order;
    self.count = 25;
    self.loadcars();
  },'doSearch': function(search){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadSucursals();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.sucursalStatus = status;
     if(status !== 'PENDIENTE'){
      self.sucursalCompleteOrder = true;
     }
     self.doSearch();
  },'authCheck': function(){
     Security.authCheck();
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
self.authCheck();
self.loadSucursal();
self.loadSucursals();

return self;
}]);
})();
