'use strict';

var inventoryModule = angular.module('inventarios')
.controller('InventariosListController',
	['InventariosService',
	'$scope',
	'InventoryRestServices',
	'$http',
	'$q',
	'NgTableParams',
	'$modal',
	'$timeout',
	'Authentication',
	'$state',
	'ParameterRestServices',
	'SucursalsService',
	function(
		InventariosService,
		$scope,
		InventoryRestServices,
		$http,
		$q,
		NgTableParams,
		$modal,
		$timeout,
		Authentication,
		$state,
		ParameterRestServices,
		SucursalsService) {

		var vm = this;
  // vm.user = Authentication.user;

  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
  vm.paramRestServices = ParameterRestServices;
  vm.inventoryServices = InventoryRestServices;
  // vm.tableParams = new NgTableParams({}, {
  //   dataset: angular.copy(vm.inventoryServices.listinventoryPromotion)
  // });

  var settings = {
  	filterDelay: 300,
  	total: 0,
  	getData: function(params) {
  		return InventariosService.get(params.url()).$promise.then(function(data) {
  			$scope.total = data.total;
  			params.total(data.total);
  			return data.results;
  		});
  	}
  };

  /* jshint ignore:start */
  $scope.tableParams = new NgTableParams({}, settings);

  vm.reloadList = function(){
  	$scope.tableParams.reload();
  };


}]);



