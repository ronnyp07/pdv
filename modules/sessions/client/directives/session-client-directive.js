'use strict';
var sessionModule = angular
.module('sessions');

sessionModule.directive('ccCard', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'modules/sessions/partials/card.html',
		'scope': {
		   'cajas': '='
		}, 'controller': function ($scope, $state, SessionRestServices, Authentication) {
			    $scope.authentication = Authentication;
				$scope.sessionInfo = Authentication.session.get('session');
			   console.log($scope.sessionInfo);
			$scope.goPos = function(){
				console.log('pos');
                $state.go('sales.pos');
			};
			$scope.openCash = function(caja){
				$scope.sessionServices = SessionRestServices;
				$scope.sessionServices.selectedCaja = caja;
				$state.go('sessions.create');
			};
		}
	};
});