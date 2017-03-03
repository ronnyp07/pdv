'use strict';
  //  controller
var userModule  = angular.module('users');
userModule.directive('userAuthorized', [ '$modal', function($modal){
    return {
    restrict: 'EA',
    scope: {
      focusinControl: '='
    },
    // controller: function(){


    // },
    link: function(scope, element, attrs) {
      scope.internalControl = scope.focusinControl || {};

      // scope.internalControl = scope.control || {};
      // scope.internalControl.takenTablets = 0;
      scope.internalControl.show = function() {
        scope.ajustarModal = $modal({
    		scope: scope,
    		'templateUrl': 'modules/user/partials/autoritation-user.html',
    		show: true,
    		backdrop: 'static'
      });
      };
    }
   };
}]);

