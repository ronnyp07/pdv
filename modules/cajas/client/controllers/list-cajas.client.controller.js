(function () {
	'use strict';

	angular
	.module('cajas')
	.controller('CajasListController', CajasListController);

	CajasListController.$inject = ['CajasService', 'CajaRestServices', 'Authentication', '$modal', '$scope', 'SucursalsService'];

	function CajasListController(CajasService, CajaRestServices, Authentication, $modal, $scope, SucursalsService) {
		var vm = this;

		vm.cajas = CajasService.query();
		vm.cajaRestServices = CajaRestServices;
		vm.cajaRestServices.caja.isActive = true;
		vm.authentication = Authentication;
		vm.userimageURL = vm.authentication.user.profileImageURL;
		vm.sucursalList = SucursalsService.query();

		vm.caja = {};


		vm.showCreateCajaModal = function(saveParam){
			if(!saveParam){
				vm.cajaRestServices.caja = {};
				vm.cajaRestServices.caja.isValid = true;
				vm.cajaRestServices.saveMode = 'create';
			}else{
				vm.cajaRestServices.saveMode = 'update';
				vm.cajaRestServices.caja = saveParam;
			}

			vm.createModal = $modal({
				scope: $scope,
				'templateUrl': 'modules/cajas/partials/template.savemodel.tpl.html',
				show: true
             // placement: 'center'
         });
		};

		vm.createCaja = function(caja, valid){
			if(valid){
				if(vm.cajaRestServices.saveMode === 'create'){
                   caja.sucursalId = vm.cajaRestServices.caja.sucursalId ? vm.cajaRestServices.caja.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
					vm.cajaRestServices.create(caja).then(function(){
						vm.cajaRestServices.doSearch();
						vm.createModal.hide();
						alertify.success('Acción realizada exitosamente!!');
					}, function(){
						alertify.error('Ha ocurrido un error en el sistema!!');
					});
				}
				if(vm.cajaRestServices.saveMode === 'update'){
					vm.cajaRestServices.updateCaja(vm.cajaRestServices.caja).then(function(){
						vm.cajaRestServices.doSearch();
						vm.createModal.hide();
						alertify.success('Acción realizada exitosamente!!');
						vm.cajaRestServices.saveMode = '';
					});
				}
			}else{
				alertify.error('Informacion incompleta!!');
			}

		};

		vm.delete = function(caja){
			if(caja.systemParam){
				alertify.error('No puede eliminar un parametro del sistema!!');

			}else{
				vm.cajaRestServices.delete(caja).then(function(){
					vm.cajaRestServices.doSearch();
					alertify.success('Acción realizada exitosamente!!');
				});
			}
		};

	}
})();
