(function () {
  'use strict';

  // Roles controller
  angular
    .module('roles')
    .controller('RolesController', RolesController);

  RolesController.$inject = ['$scope', '$state', 'Authentication', 'roleResolve'];

  function RolesController ($scope, $state, Authentication, role) {
    var vm = this;

    vm.authentication = Authentication;
    vm.role = role;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Role
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.role.$remove($state.go('roles.list'));
      }
    }

    // Save Role
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.roleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.role._id) {
        vm.role.$update(successCallback, errorCallback);
      } else {
        vm.role.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('roles.view', {
          roleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
