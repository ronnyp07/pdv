(function () {
  'use strict';

  // Cajas controller
  angular
    .module('cajas')
    .controller('CajasController', CajasController);

  CajasController.$inject = ['$scope', '$state', 'Authentication', 'cajaResolve'];

  function CajasController ($scope, $state, Authentication, caja) {
    var vm = this;

    vm.authentication = Authentication;
    vm.caja = caja;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Caja
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.caja.$remove($state.go('cajas.list'));
      }
    }

    // Save Caja
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cajaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.caja._id) {
        vm.caja.$update(successCallback, errorCallback);
      } else {
        vm.caja.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cajas.view', {
          cajaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
