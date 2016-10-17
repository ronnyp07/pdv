(function () {
	'use strict';

	angular
	.module('sucursals')
	.controller('SucursalsListController', SucursalsListController);

	SucursalsListController.$inject = ['SucursalsService', 'FileUploader', 'Authentication', '$window', 'SucursalsRestServices', '$state', 'Notify'];

	function SucursalsListController(SucursalsService, FileUploader, Authentication, $window, SucursalsRestServices, $state, Notify) {
		var vm = this;
		vm.authentication = Authentication;
		vm.userimageURL = vm.authentication.user.profileImageURL;
		vm.sucursalServices = SucursalsRestServices;

		vm.showCreateSucursalModal = function(){
			$state.go('sucursals.create');
		};

		Notify.getMsg('refreshSucursal',function(event, data){
			vm.sucursalServices.hasMore = true;
			vm.sucursalServices.page = 1;
			vm.sucursalServices.total = 0;
			vm.sucursalServices.count= 15;
			vm.sucursalServices.loadSucursals();
		});

    // vm.sucursals = SucursalsService.query();
}
})();

