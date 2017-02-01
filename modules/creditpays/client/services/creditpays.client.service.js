//Creditpays service used to communicate Creditpays REST endpoints
(function () {
  'use strict';

  var creditpaysModel = angular.module('creditpays');
    creditpaysModel.factory('CreditpaysService', CreditpaysService);

  CreditpaysService.$inject = ['$resource'];

  function CreditpaysService($resource) {
    return $resource('api/creditpays/:creditpayId', {
      creditpayId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


creditpaysModel.service('CreditpaysRestServices',  ['$q', '$http', '$timeout', 'CreditpaysService', 'Authentication', '$rootScope', function($q, $http, $timeout, CreditpaysService, Authentication, $rootScope){
    var self ={
     'creditpays': {},
     'tempAncestors': [],
     'creditpaysList': [],
     'listCreditpayPromotion': [],
     'tempSelectedCreditpay': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'creditpayCompleteOrder': false,
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
     'creditpayStatus': null,
     'formaPago': null,
     'selectedProduct': null,
     'selectedCustomer': null,
     'isLoading': false,
     'carList': [],
     'loadCreditpays': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.creditpayStatus ? self.creditpayStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        CreditpaysService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.creditpaysList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.creditpaysList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadCreditpays();
     },
    'getCreditpayFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/CreditpayFilter', data)
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
    },'getMaxCreditpay': function(val){
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
    var Creditpay = new CreditpaysService(param);
    Creditpay.$update(function(data){
      self.Creditpay = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },
  'create': function(creditpay){
    var defer = $q.defer();
    self.isSaving = true;
    var Creditpay = new CreditpaysService(creditpay);
    Creditpay.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },
  'delete': function(Creditpay){
    var defer = $q.defer();
    self.isSaving = true;
    var CreditpayDelete = new CreditpaysService({ _id : Creditpay._id});
    CreditpayDelete.$remove(function(data){
     self.Creditpay = {};
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
    self.loadCreditpays();
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.creditpayStatus = status;
     if(status !== 'PENDIENTE'){
      self.creditpayCompleteOrder = true;
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
self.loadCreditpays();

return self;
}]);


})();
