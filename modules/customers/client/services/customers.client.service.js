//Customers service used to communicate Customers REST endpoints
(function () {
  'use strict';
  var customersModule =  angular.module('customers');
  customersModule.factory('CustomersService', CustomersService);

  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    return $resource('api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

 customersModule.factory('CustomersListService', ['$resource', function($resource) {
  // Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/listPagination', {
      query: {
        method: 'GET',
        isArray: true
      }
    });
}]);


 customersModule.service('CustomerRestServices',  ['$q', '$http', '$timeout', 'CustomersService', '$rootScope', function($q, $http, $timeout, CustomersService, $rootScope){
    var self ={
     'customers': [],
     'customer': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'scollCount': 5,
     'count': 25,
     'counter': 10,
     'ordering': null,
     'search': '',
     'isSaving': false,
     'isLoading': false,
     'customersList': [],
     'loadcustomers': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch,
         name: self.customerName},
         'ordering': self.ordering
       };
        CustomersService.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.customerList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.customerList.push(item);
          });

          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
       return defer.promise;
     },'loadScrollcustomers': function(){
      if (self.hasMore && !self.isLoading){
      self.isLoading = true;
      var params = {
        'page': self.page,
        'search': self.search,
        'ordering': self.ordering,
         count: 15
      };

      CustomersService.get(params, function(data){
        self.total = data.total;
        //self.count = parseInt(data.options.count);

       if(data){
           angular.forEach(data.results, function(item){
                self.customersList.push(item);
           });
        }
         console.log(self.customersList);
        if(self.customersList.length >= data.total){
            self.hasMore = false;
        }
        self.isLoading = false;
      });
     }
     },'updatecustomer': function(param){
        var defer = $q.defer();
        self.isSaving = true;
        var customer = new CustomersService(param);
        customer.$update(function(data){
        $timeout(function(){
          self.isSaving = false;
           // alertify.success('Acción realizada exitosamente!!');
        }, 2000);
            // self.loadcars();
            // self.loadParamList();
             self.customer = null;
             defer.resolve();
        }, function(err){
            self.isSaving = false;
            defer.reject(err);
        });
        return defer.promise;
     },'loadMore': function(page){
        self.count += self.counter;
        self.loadcustomers();
     },'scrollMore': function(){
      if(self.customersList.length <= 0){
        self.page = 1 ;
        self.loadScrollcustomers();
      }else{
        if(self.hasMore && !self.isLoading){
            self.page += 1;
            self.scollCount += self.scollCount;
            self.loadScrollcustomers();
        }
      }
      },'create': function(customers){
        var defer = $q.defer();
        self.isSaving = true;
        var customer = new CustomersService(customers);
        customer.$save(function(data){
            console.log('saved');
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadcustomers();
         defer.resolve();
        }, function(err){
            console.log(err);
           defer.reject(err);
        });
        return defer.promise;

     },'delete': function(customer){
        var defer = $q.defer();
        self.isSaving = true;
        var customerDelete = new CustomersService({ _id : customer._id});
        customerDelete.$remove(function(data){
            console.log('saved');
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadcustomers();
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
        self.cars = [];
        self.search = search;
        self.count = 25;
        self.loadcars();
     },'doSearchScroll': function () {
      self.hasMore = true;
      self.page = 1;
      self.customersList = [];
      self.scrollMore();
    },'watchFilters': function () {
      $rootScope.$watch(function () {
        return self.search;
      }, function (newVal) {
        if (angular.isDefined(newVal)) {
          self.doSearchScroll();
        }
      });
    }
  };
  self.watchFilters();
  self.loadcustomers();
  return self;

 }]);

})();
