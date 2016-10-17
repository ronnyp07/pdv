'use strict';
  //  controller
var inventoryModule  = angular.module('inventarios');
inventoryModule.directive('inventoryList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/inventarios/partials/inventory-list-detail.html'
   };
});
