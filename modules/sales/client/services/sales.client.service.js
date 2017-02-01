//Sales service used to communicate Sales REST endpoints
(function () {
  'use strict';

  var salesModel = angular.module('sales');
    salesModel.factory('SalesService', SalesService);

  SalesService.$inject = ['$resource'];

  function SalesService($resource) {
    return $resource('api/sales/:saleId', {
      saleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

salesModel.service('SalesRestServices',  ['$q', '$http', '$timeout', 'SalesService', 'Authentication', '$rootScope', '$state', function($q, $http, $timeout, SalesService, Authentication, $rootScope, $state){
    var self ={
     'sales': {},
     'tempAncestors': [],
     'salesList': [],
     'listSalePromotion': [],
     'tempSelectedSale': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'saleCompleteOrder': false,
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
     'saleStatus': null,
     'formaPago': null,
     'selectedProduct': null,
     'selectedCustomer': null,
     'isLoading': false,
     'salesPedingList': [],
     'loadSales': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.saleStatus ? self.saleStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        SalesService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.salesList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.salesList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadSales();
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
    var Sale = new SalesService(param);
    Sale.$update(function(data){
      self.Sale = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;

  },'create': function(sale){
    var defer = $q.defer();
    self.isSaving = true;
    var Sale = new SalesService(sale);
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
    var SaleDelete = new SalesService({ _id : Sale._id});
    SaleDelete.$remove(function(data){
     self.Sale = {};
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;

  },'getSales': function(val){
     var data = {
       status: val.status,
       cajaturno : val.cajaturno
     };
     var result = [];
     var defer =  $q.defer();

     $http.post('/api/salesList', data)
     .success(function(response) {
      angular.forEach(response, function(card) {
        result.push(card);
      });
       defer.resolve(result);
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
    self.loadSales();
  },'uploadSessionInfo': function(){
       self.cajaturnoInfo =  Authentication.cajaturno.get('cajaturno');
        if(!self.cajaturnoInfo){
          var data = {
          user : Authentication.user._id
          };

          $http.post('/api/getMulFilter', data)
          .success(function(result){
           Authentication.cajaturno.put('cajaturno', result[0]);
           if(result.length <=0){
              $state.go('cajaturno.opencajaturno');
           }else{
           self.cajaturnoInfo = Authentication.cajaturno.get('cajaturno');
           }
        });
        }
  },'loadSucursal' : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
      self.provider ='';
  },'setStatus': function(status){
     self.saleStatus = status;
     if(status !== 'PENDIENTE'){
      self.saleCompleteOrder = true;
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
self.loadSales();
self.uploadSessionInfo();

return self;
}]);


})();
