'use strict';

  // Categories controller
  var categoryModule  = angular.module('categories');

categoryModule.directive('categoryList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/categories/partials/category-list-detail.html'
   };
});

