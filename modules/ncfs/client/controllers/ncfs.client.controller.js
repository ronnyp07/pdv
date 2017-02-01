(function () {
  'use strict';

  // Ncfs controller
  angular
    .module('ncfs')
    .controller('NcfsController', NcfsController);

  NcfsController.$inject = ['$scope', '$state', 'Authentication', 'ncfResolve'];

  function NcfsController ($scope, $state, Authentication, ncf) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ncf = ncf;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ncf
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.ncf.$remove($state.go('ncfs.list'));
      }
    }

    // Save Ncf
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ncfForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ncf._id) {
        vm.ncf.$update(successCallback, errorCallback);
      } else {
        vm.ncf.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ncfs.view', {
          ncfId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
