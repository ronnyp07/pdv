 'use strict';
 
 var categoryModule = angular.module('categories');  
 categoryModule.controller('CategoriesListController',['CategoriesService', 'ParametersService', '$scope', 'NgTableParams','$modal',  function CategoriesListController(CategoriesService, ParametersService, $scope, NgTableParams, $modal) {

    var vm = this;
  	var params = {
          page: 1,            
          count: 3
       };

    var settings = {
         filterDelay: 300,
         total: 0,          
         getData: function(params) {
          return ParametersService.get(params.url()).$promise.then(function(data) {
          $scope.total = data.total;
          params.total(data.total);
          return data.results;
        });
       }
       };

        vm.showCreateModal = function(saveParam){
        if(!saveParam){
           vm.services.customer = {};
           vm.services.saveMode = 'create';
        }else{
           vm.services.saveMode = 'update';
           vm.services.customer = saveParam;
        }

        vm.createModal = $modal({
             scope: $scope,
             'templateUrl': 'modules/categories/partials/template.savemodel.tpl.html',
             show: true
             // placement: 'center'
        });
    };

        /* jshint ignore:start */
       $scope.tableParams = new NgTableParams({}, settings);


}]);