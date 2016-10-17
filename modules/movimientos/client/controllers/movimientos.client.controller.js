(function () {
  'use strict';

  // Movimientos controller
  angular
    .module('movimientos')
    .controller('MovimientosController', MovimientosController);

  MovimientosController.$inject = ['$scope', '$state', 'Authentication', 'movimientoResolve'];

  function MovimientosController ($scope, $state, Authentication, movimiento) {
    var vm = this;

    vm.authentication = Authentication;
    vm.movimiento = movimiento;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Movimiento
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.movimiento.$remove($state.go('movimientos.list'));
      }
    }

    // Save Movimiento
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.movimientoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.movimiento._id) {
        vm.movimiento.$update(successCallback, errorCallback);
      } else {
        vm.movimiento.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('movimientos.view', {
          movimientoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
