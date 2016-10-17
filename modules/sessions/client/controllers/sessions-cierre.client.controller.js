(function () {
	'use strict';

	angular
	.module('sessions')
	.controller('SessionsCierreController', SessionsCierreController);

	SessionsCierreController.$inject = ['SessionsService', 'CajaRestServices', 'Authentication', 'SucursalsService', 'SessionRestServices', '$state', 'socketio',  '$rootScope', 'SalesRestServices', '$scope', '$modal', 'MovimientoRestServices'];

	function SessionsCierreController(SessionsService, CajaRestServices, Authentication, SucursalsService, SessionRestServices, $state, socketio,  $rootScope, SalesRestServices, $scope, $modal, MovimientoRestServices){
		var vm = this;
		$rootScope.nav = true;
		vm.authentication = Authentication;
		vm.salesServices = SalesRestServices;
		vm.sessionSercices = SessionRestServices;
		vm.movServices = MovimientoRestServices;
		vm.sessionSercices.sessionInfo = vm.authentication.session.get('session');
		vm.cierreList = vm.sessionSercices.cuadreList;
		vm.sessionSercices.efectivo  = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.tarjeta = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.cheque = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.vales = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.transferencia = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.totales = { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 };
        vm.sessionSercices.salesInfo = { ventasNetas: 0, itbs: 0, brutos: 0, ventasCredito : 0, totalTran: 0, ventasEfectivo: 0, entradas: 0, salidas: 0 };
		vm.activePath = 'pending';
		var active_view = 0,
		paths = ['pending', 'cuadre', 'review'],
		max_active = paths.length - 1;

		vm.salesServices.getSales({session: vm.sessionSercices.sessionInfo._id}).then(function(sales){
			vm.salesPendingInfo = _.chain(sales)
			.filter(isPending)
			.map(function(item){
				return {
					_id: item._id,
					salesId : item.salesId,
					fecha_venta: item.fecha_venta,
					total: item.total,
					customer: item.customer
				};
			})
			.value();

			function isPending(sales){
				if (sales.status === 'ESPERA'){
					return sales;
				}
			}

			_.forEach(sales, function (i) {
				getEfectivo(i);
			});

			function getEfectivo(sales){
				if(sales.status !== 'ESPERA'){
					vm.sessionSercices.salesInfo.ventasNetas += sales.subtotal;
					vm.sessionSercices.salesInfo.itbs += sales.itbs;
					if(sales.efectivo !== 0){
						vm.sessionSercices.efectivo.calculado += sales.total;
					}else if(sales.tarjeta !== 0){
						vm.sessionSercices.tarjeta.calculado += sales.total;
					}else if(sales.cheque !== 0){
						vm.sessionSercices.cheque.calculado += sales.total;
					}else if(sales.vales !== 0){
						vm.sessionSercices.vales.calculado += sales.total;
					}else if(sales.transferencia !== 0){
						vm.sessionSercices.transferencia.calculado += sales.total;
					}else if(sales.formaPago === 'credito') {
						vm.sessionSercices.salesInfo.ventasCredito += sales.credito;
					}
				}
			}

			vm.sessionSercices.salesInfo.brutos += vm.sessionSercices.salesInfo.ventasNetas + vm.sessionSercices.salesInfo.itbs;
			vm.sessionSercices.salesInfo.salidas += vm.sessionSercices.salesInfo.ventasNetas + vm.sessionSercices.salesInfo.itbs;
			vm.sessionSercices.salesInfo.totalTran = vm.sessionSercices.salesInfo.ventasCredito + vm.sessionSercices.salesInfo.brutos;
			vm.sessionSercices.salesInfo.totalFondo = vm.sessionSercices.sessionInfo.cuadreOpen.efectivo + vm.sessionSercices.sessionInfo.cuadreOpen.tarjeta + vm.sessionSercices.sessionInfo.cuadreOpen.cheque + vm.sessionSercices.sessionInfo.cuadreOpen.vales + vm.sessionSercices.sessionInfo.cuadreOpen.transferencia;
			vm.sessionSercices.salesInfo.ventasEfectivo = getEfectivoTotal();

			vm.movServices.getMovList({session: vm.sessionSercices.sessionInfo._id, status: true}).then(function(mov){
				_.each(mov, function(item){
					vm.sessionSercices.totales.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
					vm.sessionSercices.totales.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
					if(item.tipoPago === 'EFECTIVO'){
						vm.sessionSercices.efectivo.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
						vm.sessionSercices.efectivo.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
					}else if(item.tipoPago === 'TARJETA'){
						vm.sessionSercices.tarjeta.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
						vm.sessionSercices.tarjeta.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
					}else if(item.tipoPago === 'CHEQUE'){
						vm.sessionSercices.cheque.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
						vm.sessionSercices.cheque.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
                    }else if(item.tipoPago === 'VALES'){
						vm.sessionSercices.vales.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
						vm.sessionSercices.vales.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
                     }else if(item.tipoPago === 'TRAN'){
						vm.sessionSercices.transferencia.ac += item.tipoMovimiento === 'AC' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.com += item.tipoMovimiento === 'COM' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.dev += item.tipoMovimiento === 'DEV' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.ap += item.tipoMovimiento === 'AP' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.nc += item.tipoMovimiento === 'NC' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.sa += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
						vm.sessionSercices.transferencia.en += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
                      }
			});

			 vm.sessionSercices.efectivo.entradas += vm.sessionSercices.efectivo.ac + vm.sessionSercices.efectivo.en;
			 vm.sessionSercices.efectivo.salidas += vm.sessionSercices.efectivo.com + vm.sessionSercices.efectivo.dev + vm.sessionSercices.efectivo.ap + vm.sessionSercices.efectivo.nc + vm.sessionSercices.efectivo.sa;
             vm.sessionSercices.tarjeta.entradas += vm.sessionSercices.tarjeta.ac + vm.sessionSercices.tarjeta.en;
			 vm.sessionSercices.tarjeta.salidas += vm.sessionSercices.tarjeta.com + vm.sessionSercices.tarjeta.dev + vm.sessionSercices.tarjeta.ap + vm.sessionSercices.tarjeta.nc + vm.sessionSercices.tarjeta.sa;
             vm.sessionSercices.cheque.entradas += vm.sessionSercices.cheque.ac + vm.sessionSercices.cheque.en;
             vm.sessionSercices.cheque.salidas += vm.sessionSercices.cheque.com + vm.sessionSercices.cheque.dev + vm.sessionSercices.cheque.ap + vm.sessionSercices.cheque.nc + vm.sessionSercices.cheque.sa;
             vm.sessionSercices.vales.entradas += vm.sessionSercices.vales.ac + vm.sessionSercices.vales.en;
             vm.sessionSercices.vales.salidas += vm.sessionSercices.vales.com + vm.sessionSercices.vales.dev + vm.sessionSercices.vales.ap + vm.sessionSercices.vales.nc + vm.sessionSercices.vales.sa;
             vm.sessionSercices.transferencia.entradas += vm.sessionSercices.transferencia.ac + vm.sessionSercices.transferencia.en;
             vm.sessionSercices.transferencia.salidas += vm.sessionSercices.transferencia.com + vm.sessionSercices.transferencia.dev + vm.sessionSercices.transferencia.ap + vm.sessionSercices.transferencia.nc + vm.sessionSercices.transferencia.sa;

			function calculateMov(mov){
               vm.sessionSercices.efectivo.calculado += vm.sessionSercices.efectivo.entradas - vm.sessionSercices.efectivo.salidas;
               vm.sessionSercices.efectivo.diferencia +=  vm.sessionSercices.efectivo.calculado;
               vm.sessionSercices.tarjeta.calculado += vm.sessionSercices.tarjeta.entradas - vm.sessionSercices.tarjeta.salidas;
               vm.sessionSercices.tarjeta.diferencia +=  vm.sessionSercices.tarjeta.calculado;
               vm.sessionSercices.cheque.calculado += vm.sessionSercices.cheque.entradas - vm.sessionSercices.cheque.salidas;
               vm.sessionSercices.cheque.diferencia +=  vm.sessionSercices.cheque.calculado;
               vm.sessionSercices.vales.calculado += vm.sessionSercices.vales.entradas - vm.sessionSercices.vales.salidas;
               vm.sessionSercices.vales.diferencia +=  vm.sessionSercices.vales.calculado;
               vm.sessionSercices.transferencia.calculado += vm.sessionSercices.transferencia.entradas - vm.sessionSercices.transferencia.salidas;
               vm.sessionSercices.transferencia.diferencia +=  vm.sessionSercices.transferencia.calculado;
             };

             calculateMov();
           vm.sessionSercices.totales.calculado = vm.sessionSercices.efectivo.calculado + vm.sessionSercices.tarjeta.calculado + vm.sessionSercices.cheque.calculado + vm.sessionSercices.vales.calculado + vm.sessionSercices.transferencia.calculado;
		   vm.sessionSercices.totales.diferencia = vm.sessionSercices.totales.calculado;

          });
				vm.sessionSercices.efectivo.calculado += vm.sessionSercices.sessionInfo.cuadreOpen.efectivo;
				vm.sessionSercices.tarjeta.calculado += vm.sessionSercices.sessionInfo.cuadreOpen.tarjeta;
				vm.sessionSercices.cheque.calculado += vm.sessionSercices.sessionInfo.cuadreOpen.cheque;
				vm.sessionSercices.vales.calculado += vm.sessionSercices.sessionInfo.cuadreOpen.vales;
				vm.sessionSercices.transferencia.calculado += vm.sessionSercices.sessionInfo.cuadreOpen.transferencia;

		      function getEfectivoTotal(){
					return vm.sessionSercices.efectivo.calculado + vm.sessionSercices.tarjeta.calculado + vm.sessionSercices.cheque.calculado + vm.sessionSercices.vales.calculado + vm.sessionSercices.transferencia.calculado;
				}
		});



vm.refreshData = function(index, input){
	vm.sessionSercices.cierreCalculateTotal(index, input).then(function(data){
		vm.cierreList = data;
		vm.total = vm.sessionSercices.getTotal(vm.cierreList);
	});
};

vm.selectCalculate = function(){
	vm.createModal.hide();
	vm.sessionSercices.efectivo.contado = vm.total;
	vm.calculateType('efectivo');
};

vm.calculateType = function(type){
  vm.sessionSercices.calculateType(type).then(function(){
       getTotal();
  });
};

function getTotal(){
	vm.sessionSercices.totales.contado = vm.sessionSercices.efectivo.contado + vm.sessionSercices.tarjeta.contado + vm.sessionSercices.cheque.contado + vm.sessionSercices.vales.contado + vm.sessionSercices.transferencia.contado;
	vm.sessionSercices.totales.diferencia = vm.sessionSercices.totales.contado - vm.sessionSercices.totales.calculado;
	vm.sessionSercices.totales.retirado = vm.sessionSercices.efectivo.retirado + vm.sessionSercices.tarjeta.retirado + vm.sessionSercices.cheque.retirado + vm.sessionSercices.vales.retirado + vm.sessionSercices.transferencia.retirado;
}

vm.deletePending = function(sale){
	console.log(sale);
	vm.salesServices.delete(sale);
	$state.reload();
};

vm.openCalculator = function(){
	vm.createModal = $modal({
		scope: $scope,
		'templateUrl': 'modules/sessions/partials/calculate.html',
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
	if((vm.activePath === 'pending' &&  vm.salesPendingInfo.length  <= 0) || (vm.activePath === 'cuadre' &&  vm.salesPendingInfo.length  <= 0)){
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