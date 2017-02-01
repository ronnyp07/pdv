(function () {
  'use strict';

  // Lotes controller
  angular
    .module('lotes')
    .controller('LotesController', LotesController);

  LotesController.$inject = ['$scope', '$state', 'Authentication', 'loteResolve'];

  function LotesController ($scope, $state, Authentication, lote) {
    var vm = this;

    vm.authentication = Authentication;
    vm.lote = lote;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Lote
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.lote.$remove($state.go('lotes.list'));
      }
    }

    // Save Lote
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.loteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.lote._id) {
        vm.lote.$update(successCallback, errorCallback);
      } else {
        vm.lote.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lotes.view', {
          loteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
