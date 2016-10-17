 'use strict';

  angular
  .module('sales')
  .directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
    	$element.bind('click', function() {
    		console.log('cli');
            // var src = elem.find('img').attr('src');
           console.log(angular.element('#cartFrameDiv'));
            // call your SmoothZoom here
            // angular.element(attrs.options).css({'background-image':'url('+ scope.item.src +')'});
        });
    	// cartFrameDiv
    	var myEl = angular.element( document.querySelector( '#some-id' ) );
      $timeout(function() {
        $element[0].focus();
      });
    }
  };
}]).directive('buttonAction', function(){
  return{
    restrict: 'E',
    templateUrl: 'modules/sales/partials/button-action.html',
    link: function(scope, el, attr){
    }
  };
}).directive('salesList', function(){
  return{
    restrict: 'E',
    templateUrl: 'modules/sales/partials/sales-details.html',
    scope: {
      'layout': '='
    },
    link: function(scope, el, attr){

    }
  };
});