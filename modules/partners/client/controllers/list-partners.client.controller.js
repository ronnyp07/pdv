(function () {
	'use strict';

	angular
	.module('partners')
	.controller('PartnersListController', PartnersListController);

	PartnersListController.$inject = ['PartnersService', 'FileUploader', 'Authentication', '$window', 'PartnersRestServices', '$state', 'Notify'];

	function PartnersListController(PartnersService, FileUploader, Authentication, $window, PartnersRestServices, $state, Notify) {
		var vm = this;
		vm.authentication = Authentication;
		vm.userimageURL = vm.authentication.user.profileImageURL;
		vm.partnerServices = PartnersRestServices;

		vm.showCreatePartnerModal = function(saveParam){
			if(!saveParam){
				vm.PartnerServices.partners = {};
				vm.PartnerServices.saveMode = 'create';
			}else{
				vm.PartnerServices.saveMode = 'update';
				vm.PartnerServices.partners = saveParam;
			}
			$state.go('partners.create');
		};

		Notify.getMsg('refreshCompany',function(event, data){
			vm.partnerServices.hasMore = true;
			vm.partnerServices.page = 1;
			vm.partnerServices.total = 0;
			vm.partnerServices.count= 15;
			vm.partnerServices.loadPartners();
		});

    // vm.partners = PartnersService.query();
}
})();
