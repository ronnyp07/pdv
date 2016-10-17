(function () {
  'use strict';

  // Abonos controller
  angular
    .module('abonos')
    .controller('AbonosController', AbonosController);

  AbonosController.$inject = ['$scope', '$state', 'Authentication', 'abonoResolve'];

  function AbonosController ($scope, $state, Authentication, abono) {
    var vm = this;

    vm.authentication = Authentication;
    vm.abono = abono;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Abono
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.abono.$remove($state.go('abonos.list'));
      }
    }

    // Save Abono
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.abonoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.abono._id) {
        vm.abono.$update(successCallback, errorCallback);
      } else {
        vm.abono.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('abonos.view', {
          abonoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
