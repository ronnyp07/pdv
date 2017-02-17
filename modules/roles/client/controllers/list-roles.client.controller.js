(function () {
	'use strict';

	angular
	.module('roles')
	.controller('RolesListController', RolesListController);

	RolesListController.$inject = ['RolesService', '$modal', '$scope', 'ParameterRestServices'];

	function RolesListController(RolesService, $modal, $scope, ParameterRestServices) {
		var vm = this;
		vm.parameterServices = ParameterRestServices;
		vm.roles = RolesService.query();
		vm.selectedMenu = null;

		vm.showRoleModal = function(){
			vm.createModal = $modal({
				scope: $scope,
				'templateUrl': 'modules/roles/partials/role-template.html',
				show: true,
				backdrop: 'static'
			});
		};

		//Todo: create Role
		vm.saveRole = function(){
			console.log('create');
			vm.createModal.hide();
		};

		//Todo set the SubMenu Filter
		vm.setSubMenu = function(filter){
			   console.log(filter);
               vm.selectedMenu = filter;
		};
	}
})();
