//Categories service used to communicate Categories REST endpoints
(function () {
  'use strict';

  var categorysModule = angular.module('categories');
  categorysModule.factory('CategoriesService', CategoriesService);

  CategoriesService.$inject = ['$resource'];

  function CategoriesService($resource) {
    return $resource('api/categories/:categoryId', {
      categoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  categorysModule.service('CategoryRestServices',  ['$q', '$http', '$timeout', 'CategoriesService', function($q, $http, $timeout, CategoriesService){
    var self ={
     'categories': [],
     'category': null,
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
     'loadcategorys': function(){

     },
     // 'loadParamList': function(){
     //   CarsList.query(function(data){
     //     if(data){
     //       angular.forEach(data, function(item){
     //            self.carList.push(item);  
     //       });
     //    }
     //   });
     // },
     // 'cars': [],
     'updatecategory': function(param){
        var defer = $q.defer();
        self.isSaving = true;
        var category = new CategoriesService(param);
        category.$update(function(data){

        $timeout(function(){
          self.isSaving = false;
           // alertify.success('Acción realizada exitosamente!!');
        }, 2000);
            // self.loadcars();
            // self.loadParamList();
             self.category = null;
             defer.resolve();
        }, function(err){
            self.isSaving = false;
            defer.reject(err);
        });
        return defer.promise;
     },
     'create': function(categorys){
        var defer = $q.defer();
        self.isSaving = true;
        var category = new CategoriesService(category);
        category.$save(function(data){
            console.log('saved');
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadcategorys();
         defer.resolve();
        }, function(err){
            console.log(err);
           defer.reject(err);
        });
        return defer.promise;

     },
     'delete': function(category){
        var defer = $q.defer();
        self.isSaving = true;
        var categoryDelete = new CategoriesService({ _id : category._id});
        categoryDelete.$remove(function(data){
            console.log('saved');
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadcategorys();
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
  self.loadcategorys();
  return self;

 }]);
})();
