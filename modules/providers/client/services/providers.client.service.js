//providers service used to communicate providers REST endpoints
(function () {
  'use strict';

  var providersModule = angular.module('providers');
  providersModule.factory('providersService', providersService);

  providersService.$inject = ['$resource'];

  function providersService($resource) {
    return $resource('api/providers/:ProviderId', {
      ProviderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET' }
    });
  }

  providersModule.service('ProviderRestServices',  ['$q', '$http', '$timeout', 'providersService', function($q, $http, $timeout, ProvidersService){
    var self ={
     'providers': [],
     'tempAncestors': [],
     'tempParent': null,
     'provider': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'count': 25,
     'ordering': null,
     'search': '',
     'isSaving': false,
     'isLoading': false,
     'carList': [],
     'getParamsFilter': function(val){
      var data = {
        lastName: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/providerfilter', data)
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
    'loadproviders': function(){
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/providerList')
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
    },'updateProvider': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      var Provider = new ProvidersService(param);
      Provider.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.provider = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },
    'create': function(providers){
      var defer = $q.defer();
      self.isSaving = true;
      var Provider = new ProvidersService(providers);

      Provider.$save(function(data){
       self.tempAncestors = [];
       self.provider = {};
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadproviders();
            defer.resolve();
          }, function(err){
            console.log(err);
            defer.reject(err);
          });
      return defer.promise;

    },
    'delete': function(Provider){
      var defer = $q.defer();
      self.isSaving = true;
      var ProviderDelete = new ProvidersService({ _id : Provider._id});
      ProviderDelete.$remove(function(data){
       self.provider = {};
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadproviders();
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
      self.cars = [];
      self.search = search;
      self.count = 25;
      self.loadcars();
    }
  };
  self.loadproviders();
  return self;

}]);
})();
