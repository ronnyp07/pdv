(function () {
  'use strict';

  // Sessions controller
  angular
  .module('sessions')
  .controller('SessionsController', SessionsController);

  SessionsController.$inject = ['$scope', '$state', 'Authentication',  'ParameterRestServices', 'SessionRestServices', 'CajaRestServices', 'socketio', 'SucursalsService', '$modal', '$rootScope'];

  function SessionsController ($scope, $state, Authentication,   ParameterRestServices, SessionRestServices, CajaRestServices, socketio, SucursalsService, $modal, $rootScope) {
    var vm = this;
    $rootScope.nav = false;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.paramRestServices = ParameterRestServices;
    vm.sessionSercices = SessionRestServices;
    vm.cierreList = vm.sessionSercices.cuadreList;
    vm.cajaRestServices = CajaRestServices;
    vm.total = vm.sessionSercices.getTotal(vm.cierreList);
    vm.sucursalServices = SucursalsService;
    vm.sessionObj = {
      cuadreOpen: {}
    };
    vm.amount = {};

    vm.refreshData = function(index, input){
      vm.sessionSercices.cierreCalculateTotal(index, input).then(function(data){
       vm.cierreList = data;
       vm.total = vm.sessionSercices.getTotal(vm.cierreList);
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
       'templateUrl': 'modules/sessions/partials/calculate.html',
       show: true
             // placement: 'center'
           });
   };

   vm.session = function(){
     if(vm.sessionSercices.selectedCaja){
       vm.sessionObj.cuadreOpen.openCalculate = vm.cierreList;
       vm.sessionObj.cuadreOpen.efectivo = vm.amount.efectivo ? vm.amount.efectivo : 0;
       vm.sessionObj.cuadreOpen.tarjeta = vm.amount.tarjeta ? vm.amount.tarjeta : 0;
       vm.sessionObj.cuadreOpen.cheque = vm.amount.cheque ? vm.amount.cheque : 0;
       vm.sessionObj.cuadreOpen.cheque = vm.amount.vales ? vm.amount.vales : 0;
       vm.sessionObj.cuadreOpen.transferencia = vm.amount.transferencia ? vm.amount.transferencia : 0;
       vm.sessionObj.caja = vm.sessionSercices.selectedCaja._id;
       vm.sessionObj.sucursalId = vm.sessionSercices.selectedCaja.sucursalId._id;
       vm.sessionSercices.create(vm.sessionObj).then(function(data){
        vm.sessionSercices.selectedCaja.inUse = true;
        vm.sessionSercices.selectedCaja.session = data._id;
        vm.cajaRestServices.update(vm.sessionSercices.selectedCaja).then(function(){
          data.sucursalInfo = SucursalsService.get({sucursalId: data.sucursalId});
          vm.authentication.session.put('session', data);
          $state.go('sales.pos');
        });
      });
     }else{
      alertify.error('Volver a selecionar la caja');
    }
  };
}
})();
