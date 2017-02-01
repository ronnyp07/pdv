(function () {
  'use strict';

  // Cajaturno controller
  angular
  .module('cajaturno')
  .controller('CajaturnoController', CajaturnoController);

  CajaturnoController.$inject = ['$scope', '$state', 'Authentication',  'ParameterRestServices', 'CajaturnoRestServices', 'CajaRestServices', 'socketio', 'SucursalsService', '$modal', '$rootScope'];

  function CajaturnoController ($scope, $state, Authentication, ParameterRestServices, CajaturnoRestServices, CajaRestServices, socketio, SucursalsService, $modal, $rootScope) {
    var vm = this;
    $rootScope.nav = false;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.paramRestServices = ParameterRestServices;
    vm.cajaturnoSercices = CajaturnoRestServices;
    vm.cierreList = vm.cajaturnoSercices.cuadreList;
    vm.cajaRestServices = CajaRestServices;
    vm.total = vm.cajaturnoSercices.getTotal(vm.cierreList);
    vm.sucursalServices = SucursalsService;
    vm.cajaturnoObj = {
      cuadreOpen: {}
    };
    vm.amount = {};

    vm.refreshData = function(index, input){
      vm.cajaturnoSercices.cierreCalculateTotal(index, input).then(function(data){
       vm.cierreList = data;
       vm.total = vm.cajaturnoSercices.getTotal(vm.cierreList);
     });
    };

    //calcula el resultado de los cambios
    vm.selectCalculate = function(){
      vm.createModal.hide();
      console.log(vm.total);
      vm.amount.efectivo = vm.total;
    };

    vm.openCalculator = function(){
     vm.createModal = $modal({
       scope: $scope,
       'templateUrl': 'modules/cajaturnos/partials/calculate.html',
       show: true
             // placement: 'center'
           });
   };

   vm.cajaturno = function(){
     if(vm.cajaturnoSercices.selectedCaja){
       vm.cajaturnoObj.cuadreOpen.openCalculate = vm.cierreList;
       vm.cajaturnoObj.cuadreOpen.efectivo = vm.amount.efectivo ? vm.amount.efectivo : 0;
       vm.cajaturnoObj.cuadreOpen.tarjeta = vm.amount.tarjeta ? vm.amount.tarjeta : 0;
       vm.cajaturnoObj.cuadreOpen.cheque = vm.amount.cheque ? vm.amount.cheque : 0;
       vm.cajaturnoObj.cuadreOpen.vales = vm.amount.vales ? vm.amount.vales : 0;
       vm.cajaturnoObj.cuadreOpen.transferencia = vm.amount.transferencia ? vm.amount.transferencia : 0;
       vm.cajaturnoObj.caja = vm.cajaturnoSercices.selectedCaja._id;
       vm.cajaturnoObj.sucursalId = vm.cajaturnoSercices.selectedCaja.sucursalId._id;
       vm.cajaturnoSercices.create(vm.cajaturnoObj).then(function(data){
        vm.cajaturnoSercices.selectedCaja.inUse = true;
        vm.cajaturnoSercices.selectedCaja.cajaturno = data._id;
        vm.cajaRestServices.update(vm.cajaturnoSercices.selectedCaja).then(function(){
          data.sucursalInfo = SucursalsService.get({sucursalId: data.sucursalId});
          vm.authentication.cajaturno.put('cajaturno', data);
          $state.go('sales.pos');
        });
      });
     }else{
      alertify.error('Volver a selecionar la caja');
    }
  };
}
})();
