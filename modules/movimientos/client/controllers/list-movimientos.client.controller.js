(function () {
  'use strict';

  angular
    .module('movimientos')
    .controller('MovimientosListController', MovimientosListController);

  MovimientosListController.$inject = ['MovimientosService'];

  function MovimientosListController(MovimientosService) {
    var vm = this;

    vm.movimientos = MovimientosService.query();
  }
})();
