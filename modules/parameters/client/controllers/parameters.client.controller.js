(function () {
  'use strict';

  // Parameters controller
  angular
    .module('parameters')
    .controller('ParametersController', ParametersController);

  ParametersController.$inject = ['$scope', '$state', 'Authentication', 'parameterResolve'];

  function ParametersController ($scope, $state, Authentication, parameter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.parameter = parameter;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Parameter
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.parameter.$remove($state.go('parameters.list'));
      }
    }

    // Save Parameter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.parameterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.parameter._id) {
        vm.parameter.$update(successCallback, errorCallback);
      } else {
        vm.parameter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('parameters.view', {
          parameterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
