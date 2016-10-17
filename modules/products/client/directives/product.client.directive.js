'use strict';
  //  controller
var productModule  = angular.module('products');
productModule.directive('productList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/products/partials/product-list-detail.html'
   };
});

