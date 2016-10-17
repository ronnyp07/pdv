//Partners service used to communicate Partners REST endpoints
(function () {
  'use strict';

  var partnerModel = angular.module('partners');
  partnerModel.factory('PartnersService', PartnersService);
  PartnersService.$inject = ['$resource'];
  function PartnersService($resource) {
    return $resource('api/partners/:partnerId', {
      partnerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  partnerModel.service('PartnersRestServices',  ['$q', '$http', '$timeout', 'PartnersService', 'Authentication', '$rootScope', 'Security', '$state', function($q, $http, $timeout, PartnersService, Authentication, $rootScope, Security, $state){
    var self ={
     'partners': {},
     'tempAncestors': [],
     'partnersList': [],
     'listPartnerPromotion': [],
     'tempSelectedPartner': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'partnerCompleteOrder': false,
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
     'partnerStatus': null,
     'isLoading': false,
     'carList': [],
     'loadPartners': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        PartnersService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.partnersList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.partnersList.push(item);
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
     },'getPartnerFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/PartnerFilter', data)
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
    },'getMaxPartner': function(val){
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
    var Partner = new PartnersService(param);
    Partner.$update(function(data){
      self.Partner = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },'create': function(partner){
    var defer = $q.defer();
    self.isSaving = true;
    var Partner = new PartnersService(partner);

    Partner.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },'delete': function(Partner){
    var defer = $q.defer();
    self.isSaving = true;
    var PartnerDelete = new PartnersService({ _id : Partner._id});
    PartnerDelete.$remove(function(data){
     self.Partner = {};
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
    self.loadPartners();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.partnerStatus = status;
     if(status !== 'PENDIENTE'){
      self.partnerCompleteOrder = true;
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
self.loadPartners();

return self;
}]);
})();
