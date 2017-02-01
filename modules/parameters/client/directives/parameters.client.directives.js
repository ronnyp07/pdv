'use strict';

  // Categories controller
  var categoryModule  = angular.module('parameters');

categoryModule.directive('parameterList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/parameters/partials/parameter-list-detail.html'
   };
});

categoryModule.directive('parameter', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/parameters/partials/parameter-list-detail.html'
   };
});

