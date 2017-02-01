'use strict';
var cajaturnoModule = angular
.module('cajaturno');

cajaturnoModule.directive('ccCard', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'modules/cajaturnos/partials/card.html',
		'scope': {
		   'cajas': '='
		}, 'controller': function ($scope, $state, CajaturnoRestServices, Authentication) {
			    $scope.authentication = Authentication;
				$scope.cajaturnoInfo = Authentication.cajaturno.get('cajaturno');
			$scope.goPos = function(){
                $state.go('sales.pos');
			};
			$scope.openCash = function(caja){
				$scope.cajaturnoServices = CajaturnoRestServices;
				$scope.cajaturnoServices.selectedCaja = caja;
				$state.go('cajaturno.create');
			};
		}
	};
});