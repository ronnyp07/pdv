(function () {
	'use strict';

	angular
	.module('cajaturno')
	.controller('CajaturnoListController', CajaturnoListController);

	CajaturnoListController.$inject = ['CajaturnosService', 'CajaRestServices', 'Authentication', 'SucursalsService',  '$state', 'socketio', 'cajaturnoResolve'];

	function CajaturnoListController(CajaturnosService, CajaRestServices, Authentication, SucursalsService,  $state, socketio, cajaturno) {
		var vm = this;
		vm.cajaturnos = CajaturnosService.query();
		vm.cajaRestServices = CajaRestServices;
		vm.authentication = Authentication;
		vm.userimageURL = vm.authentication.user.profileImageURL;
		vm.sucursalList = SucursalsService.query();
        vm.cajaturno = cajaturno;
        vm.cajaturnoInfo = vm.cajaturno.uploadCajaturnoInfo();
        function init(){
		vm.cajaRestServices.loadcajas().then(function(){
			console.log(vm.cajaRestServices.cajasList);
			vm.cajaList = _.chain(vm.cajaRestServices.cajasList)
			.groupBy("sucursalId.name")
			.sortBy("sucursalId.name")
			.value();
			console.log(vm.cajaList);
		});
	   }
	    init();
		vm.caja = {};

		socketio.on('cajaturnoInserted', function(result) {
			init();
			console.log('cajaturno started');
		});

		vm.refreshData = function(index){
			console.log('asdfasd');
			console.log(index);
		};

		vm.openCash = function(caja){
			console.log(caja);
			vm.cajaturno.selectedCaja = caja;
          // $state.go('cajaturnos.create');
      };

  }
})();