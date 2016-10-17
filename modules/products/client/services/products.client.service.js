//products service used to communicate products REST endpoints
(function () {
  'use strict';

  var productsModule = angular.module('products');
  productsModule.factory('productsService', productsService);

  productsService.$inject = ['$resource'];

  function productsService($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  productsModule.service('ProductRestServices',  ['$q', '$http', '$timeout', 'productsService', '$rootScope', 'Authentication', function($q, $http, $timeout, productsService, $rootScope, Authentication){
    var self ={
     'productList': [],
     'tempAncestors': [],
     'listProductPromotion': [],
     'tempSelectedProduct': null,
     'tempParent': null,
     'authentication': Authentication,
     'prodcutName': '',
     'category': '',
     'product': {},
     'saveMode': '',
     'hasMore': true,
     'counter': 15,
     'scollCount': 5,
     'page': 1,
     'total': 0,
     'count': 15,
     'ordering': null,
     'sucursalSearch': '',
     'search': {},
     'isSaving': false,
     'isLoading': false,
     'carList': [],

     'loadproducts': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch,
         name: self.productName,
         category: self.category},
         'ordering': self.ordering
       };

       productsService.get(self.params, function(data){
        self.total = data.total;

        defer.resolve(data);
        self.productList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.productList.push(item);
          });

          self.isLoading = false;

          // if(self.count >= self.total){
          //   self.hasMore = false;
          // }
        }
      }, function(error){
        defer.reject();
      });
       return defer.promise;
     },'loadMore': function(page){
      self.count += self.counter;
      self.loadproducts();
    }, loadSucursal : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
    },'loadScrollproducts': function(){
      if (self.hasMore && !self.isLoading){
      self.isLoading = true;
      var params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch,
         name: self.productName,
         category: self.category},
        'ordering': self.ordering
      };
      console.log(params);

      productsService.get(params, function(data){
        self.total = data.total;
        //self.count = parseInt(data.options.count);

       if(data){
           angular.forEach(data.results, function(item){
                self.productList.push(item);
           });
        }

        if(self.productList.length >= data.total){
            self.hasMore = false;
        }
        self.isLoading = false;
      });
     }
     },'scrollMore': function(){
      if(self.productList.length <= 0){
        self.page = 1 ;
        self.loadScrollproducts();
      }else{
        if(self.hasMore && !self.isLoading){
            self.page += 1;
            self.scollCount += self.scollCount;
            self.loadScrollproducts();
        }
      }
    },
    'getParamsFilter': function(val){
      var data = {
        lastName: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/productfilter', data)
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
    },'filterProductBySucursal': function(val){
     console.log(val);
     var data = {
      sucursalId: val.sucursalId,
      categories: val.categories ? JSON.stringify(val.categories) : null
    };

    var result = [],
    deferred =  $q.defer();

    $http.post('/api/getProductBySucursal', data)
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

  },'incrementProductStuck':function(value){
    var defer = $q.defer();
   angular.forEach(value, function(result){
    productsService.get({productId: result._id}, function(data){
       data.inStock = data.inStock + result.quantity;
       data.$update(function(data){});
    });
  });
   defer.resolve();

  return defer.promise;
  },'decremetProductStuck':function(value){
    var defer = $q.defer();
   angular.forEach(value, function(result){
    productsService.get({productId: result._id}, function(data){
       if(data.inStock !== 0){
       data.inStock = Number(data.inStock) - Number(result.quantity);
       data.$update(function(data){});
     }
    });
  });
   defer.resolve();

  return defer.promise;
  },'getProductFilter': function(val){
    var data = {
      bardCode: val.bardCode,
      sucursalId: val.sucursalId
    };
    var result = [];
    var deferred =  $q.defer();

    $http.post('/api/productFilter', data)
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
  },'updateProduct': function(param){
    console.log(param);
    var defer = $q.defer();
    self.isSaving = true;
    var Product = new productsService(param);
    Product.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.product = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
    return defer.promise;
  },
  'create': function(products){
    var defer = $q.defer();
    self.isSaving = true;
    var Product = new productsService(products);

    Product.$save(function(data){
     self.tempAncestors = [];
     self.product = {};
     self.isSaving = false;
     self.hasMore = true;
     self.isLoading = false;
     self.page = 1;
     self.count = 25;
     self.loadproducts();
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;

  },
  'delete': function(Product){
    var defer = $q.defer();
    self.isSaving = true;
    var ProductDelete = new productsService({ _id : Product._id});
    ProductDelete.$remove(function(data){
      self.productList = [];
      self.isSaving = false;
      self.hasMore = true;
      self.isLoading = false;
      self.page = 1;
      self.count = 25;
      self.loadproducts();
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
    self.total = 0;
    self.page = 1;
    self.search.name = self.productName;
    self.count = 15;
    self.loadproducts();
  },'watchFilters': function () {
    $rootScope.$watch(function () {
      return self.productName;
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.doSearch();
      }
    });
  }
};
self.loadSucursal();
self.loadproducts();
self.watchFilters();
return self;

}]);
 })();
