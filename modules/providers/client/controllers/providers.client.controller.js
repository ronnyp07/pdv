(function () {
  'use strict';

  // Providers controller
  angular
    .module('providers')
    .controller('ProvidersController', ProvidersController);

  ProvidersController.$inject = ['$scope', '$state', 'Authentication', 'providerResolve'];

  function ProvidersController ($scope, $state, Authentication, provider) {
    var vm = this;

    vm.authentication = Authentication;
    vm.provider = provider;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Provider
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.provider.$remove($state.go('providers.list'));
      }
    }

    // Save Provider
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.providerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.provider._id) {
        vm.provider.$update(successCallback, errorCallback);
      } else {
        vm.provider.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('providers.view', {
          providerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
