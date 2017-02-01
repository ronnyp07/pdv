(function () {
	'use strict';

	angular
	.module('cajaturno')
	.controller('CajaturnoCierreController', CajaturnoCierreController);

	CajaturnoCierreController.$inject = ['CajaturnosService', 'CajaRestServices', 'Authentication', 'SucursalsService', 'CajaturnoRestServices', '$state', 'socketio',  '$rootScope', 'SalesRestServices', '$scope', '$modal', 'MovimientoRestServices'];

	function CajaturnoCierreController(CajaturnosService, CajaRestServices, Authentication, SucursalsService, CajaturnoRestServices, $state, socketio,  $rootScope, SalesRestServices, $scope, $modal, MovimientoRestServices){
		var vm = this;
		$rootScope.nav = true;
		vm.authentication = Authentication;
		vm.salesServices = SalesRestServices;
		vm.cajaturnoSercices = CajaturnoRestServices;
		vm.movServices = MovimientoRestServices;
		vm.cajaturnoSercices.cajaturnoInfo = vm.authentication.cajaturno.get('cajaturno');
		vm.cierreList = vm.cajaturnoSercices.cuadreList;
		vm.cajaServices = CajaRestServices;
		vm.cajaturnoSercices.efectivo  = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.tarjeta = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.cheque = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.vales = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.transferencia = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.totales = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
		vm.cajaturnoSercices.salesInfo = { ventasNetas: 0, itbs: 0, brutos: 0, ventasCredito : 0, totalTran: 0, ventasEfectivo: 0, entradas: 0, salidas: 0 };
		vm.activePath = 'pending';
		var active_view = 0,
		paths = ['pending', 'cuadre', 'review'],
		max_active = paths.length - 1;

		vm.cajaturnoSercices.getCuadre(vm.cajaturnoSercices.cajaturnoInfo._id);
		vm.cerrarTurno = function(){
			vm.cajaturnoSercices.cajaturnoInfo.inUse = false;
			vm.cajaturnoSercices.cajaturnoInfo.updatedDate = new Date();
			//vm.cajaturnoSercices.cajaturnoInfo.updateUser =vm.authentication.user._id;

			vm.cajaturnoSercices.cajaturnoInfo.cuadreCierre = {
               efectivo: vm.cajaturnoSercices.efectivo,
               tarjeta: vm.cajaturnoSercices.tarjeta,
               cheque: vm.cajaturnoSercices.cheque,
               vales: vm.cajaturnoSercices.vales,
               transferencia: vm.cajaturnoSercices.transferencia,
               totales:  vm.cajaturnoSercices.totales
			};

			vm.cajaturnoSercices.updateCajaturno(vm.cajaturnoSercices.cajaturnoInfo).then(function(){
                    var cajaInfo = {
                    	_id: vm.cajaturnoSercices.cajaturnoInfo.caja,
                    	inUse: false
                    };
                    vm.cajaServices.update(cajaInfo).then(function(){
                       $state.go('cajaturno.opencajaturno');
                       alertify.success('Cierre Exitoso');
                    });
			});
			vm.authentication.cajaturno.remove('cajaturno');
		};

		vm.refreshData = function(index, input){
			vm.cajaturnoSercices.cierreCalculateTotal(index, input).then(function(data){
				vm.cierreList = data;
				vm.total = vm.cajaturnoSercices.getTotal(vm.cierreList);
			});
		};

		vm.selectCalculate = function(){
			vm.createModal.hide();
			vm.cajaturnoSercices.efectivo.contado = vm.total;
			vm.calculateType('efectivo');
		};

		vm.calculateType = function(type){

			vm.cajaturnoSercices.calculateType(type).then(function(){
				getTotal();
			});

			if(vm.cajaturnoSercices.vales.retirado > vm.cajaturnoSercices.vales.contado || vm.cajaturnoSercices.cheque.retirado > vm.cajaturnoSercices.cheque.contado || vm.cajaturnoSercices.efectivo.retirado > vm.cajaturnoSercices.efectivo.contado || vm.cajaturnoSercices.efectivo.retirado > vm.cajaturnoSercices.efectivo.contado || vm.cajaturnoSercices.transferencia.retirado > vm.cajaturnoSercices.transferencia.contado){
				vm.cajaturnoSercices.isValid = false;
				alertify.error('La cantidad retirada supera la cantidaad ingresada');
				return;
			}else{
				vm.cajaturnoSercices.isValid = true;
			}

		};

		function getTotal(){
			vm.cajaturnoSercices.efectivo.mantener = vm.cajaturnoSercices.efectivo.contado - vm.cajaturnoSercices.efectivo.retirado;
			vm.cajaturnoSercices.tarjeta.mantener = vm.cajaturnoSercices.tarjeta.contado - vm.cajaturnoSercices.tarjeta.retirado;
			vm.cajaturnoSercices.cheque.mantener = vm.cajaturnoSercices.cheque.contado - vm.cajaturnoSercices.cheque.retirado;
			vm.cajaturnoSercices.vales.mantener = vm.cajaturnoSercices.vales.contado - vm.cajaturnoSercices.vales.retirado;
			vm.cajaturnoSercices.transferencia.mantener = vm.cajaturnoSercices.transferencia.contado - vm.cajaturnoSercices.transferencia.retirado;
			vm.cajaturnoSercices.totales.contado = vm.cajaturnoSercices.efectivo.contado + vm.cajaturnoSercices.tarjeta.contado + vm.cajaturnoSercices.cheque.contado + vm.cajaturnoSercices.vales.contado + vm.cajaturnoSercices.transferencia.contado;
			vm.cajaturnoSercices.totales.diferencia = vm.cajaturnoSercices.totales.contado - vm.cajaturnoSercices.totales.calculado;
			vm.cajaturnoSercices.totales.retirado = vm.cajaturnoSercices.efectivo.retirado + vm.cajaturnoSercices.tarjeta.retirado + vm.cajaturnoSercices.cheque.retirado + vm.cajaturnoSercices.vales.retirado + vm.cajaturnoSercices.transferencia.retirado;
			vm.cajaturnoSercices.totales.mantener = vm.cajaturnoSercices.efectivo.mantener + vm.cajaturnoSercices.tarjeta.mantener + vm.cajaturnoSercices.cheque.mantener + vm.cajaturnoSercices.vales.mantener + vm.cajaturnoSercices.transferencia.mantener;
		}

		vm.deletePending = function(sale){
			vm.salesServices.delete(sale);
			$state.reload();
		};

		vm.openCalculator = function(){
			vm.createModal = $modal({
				scope: $scope,
				'templateUrl': 'modules/cajaturno/partials/calculate.html',
				show: true
			});
		};

		function gotoActiveView() {
			var view = paths[active_view];
			vm.activePath = view;
		}

		vm.goBack = function () {
			if (vm.activePath !== 'pending'){
				if (active_view <= 0) {
					active_view = max_active;
				} else {
					active_view -= 1;
				}
				gotoActiveView();
			}
		};

		vm.goNext = function () {
			if(vm.cajaturnoSercices.isValid === false && vm.activePath === 'cuadre' ){
				alertify.error('La cantidad retirada supera la cantidaad ingresada');
				return;
			}

			if((vm.activePath === 'pending' &&  vm.cajaturnoSercices.salesPendingInfo.length  <= 0) || (vm.activePath === 'cuadre' &&  vm.cajaturnoSercices.salesPendingInfo.length  <= 0)){
				if (active_view >= max_active) {
					active_view = 0;
				} else {
					active_view += 1;
				}
				gotoActiveView();
			}
		};
	}
})();