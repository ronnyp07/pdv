(function () {
  'use strict';

  // Creditpays controller
  angular
    .module('creditpays')
    .controller('CreditpaysController', CreditpaysController);

  CreditpaysController.$inject = ['$scope', '$state', 'Authentication', 'creditpayResolve'];

  function CreditpaysController ($scope, $state, Authentication, creditpay) {
    var vm = this;

    vm.authentication = Authentication;
    vm.creditpay = creditpay;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Creditpay
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.creditpay.$remove($state.go('creditpays.list'));
      }
    }

    // Save Creditpay
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.creditpayForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.creditpay._id) {
        vm.creditpay.$update(successCallback, errorCallback);
      } else {
        vm.creditpay.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('creditpays.view', {
          creditpayId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
