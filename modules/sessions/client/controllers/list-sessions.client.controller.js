(function () {
	'use strict';

	angular
	.module('sessions')
	.controller('SessionsListController', SessionsListController);

	SessionsListController.$inject = ['SessionsService', 'CajaRestServices', 'Authentication', 'SucursalsService', 'SessionRestServices', '$state', 'socketio', 'sessionResolve'];

	function SessionsListController(SessionsService, CajaRestServices, Authentication, SucursalsService, SessionRestServices, $state, socketio, session) {
		var vm = this;
		vm.sessions = SessionsService.query();
		vm.cajaRestServices = CajaRestServices;
		vm.authentication = Authentication;
		vm.userimageURL = vm.authentication.user.profileImageURL;
		vm.sucursalList = SucursalsService.query();
        vm.session = session;
        vm.sessionInfo = vm.session.uploadSessionInfo();
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

		socketio.on('sessionInserted', function(result) {
			init();
			console.log('session started');
		});

		vm.refreshData = function(index){
			console.log('asdfasd');
			console.log(index);
		};

		vm.openCash = function(caja){
			console.log(caja);
			vm.session.selectedCaja = caja;
          // $state.go('sessions.create');
      };

  }
})();