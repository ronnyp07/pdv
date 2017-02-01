(function () {
  'use strict';

  // Turnocajas controller
  angular
    .module('turnocajas')
    .controller('TurnocajasController', TurnocajasController);

  TurnocajasController.$inject = ['$scope', '$state', 'Authentication', 'turnocajaResolve'];

  function TurnocajasController ($scope, $state, Authentication, turnocaja) {
    var vm = this;

    vm.authentication = Authentication;
    vm.turnocaja = turnocaja;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Turnocaja
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.turnocaja.$remove($state.go('turnocajas.list'));
      }
    }

    // Save Turnocaja
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.turnocajaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.turnocaja._id) {
        vm.turnocaja.$update(successCallback, errorCallback);
      } else {
        vm.turnocaja.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('turnocajas.view', {
          turnocajaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
