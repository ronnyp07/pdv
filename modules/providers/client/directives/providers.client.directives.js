'use strict';

  // Categories controller
  var providerModule  = angular.module('providers');

providerModule.directive('providerList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/providers/partials/provider-list-detail.html'
   };
});

