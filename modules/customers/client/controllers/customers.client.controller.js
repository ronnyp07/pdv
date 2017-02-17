 'use strict';

  // Customers controller
  var customerModule = angular.module('customers');

  customerModule.controller('CustomersController',
    ['$scope',
    '$state',
    'Authentication',
    'customerResolve',
    'CustomerRestServices',
    '$modal',
    function CustomersController ($scope, $state, Authentication, customer, CustomerRestServices, $modal) {
        var vm = this;
        vm.services = CustomerRestServices;
        vm.imageURL = 'modules/users/img/profile/default.png';
        vm.authentication = Authentication;
        vm.userimageURL = vm.authentication.user.profileImageURL;
    // vm.customer = customer;
    vm.services.customer = {
        price : 'uno'
    };
    vm.error = null;
    vm.form = {};

    vm.save = function(){
        console.log('created');
        // if(vm.services.saveMode === 'create'){
        // vm.services.create(vm.services.customer).then(function(){
        //     vm.createModal.hide();
        //     vm.services.saveMode = '';
        // });
        // }

        // if(vm.services.saveMode === 'update'){
        //     vm.services.updatecustomer(vm.services.customer).then(function(){
        //     vm.createModal.hide();
        //     vm.services.saveMode = '';
        // });
        // }
    };


    // vm.save = function(){
    //    vm.services.create(vm.customer).then(function(){
    //         console.log('customer created!!');
    //    });
    // };


     // Save Category
    // function save(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
    //     return false;
    //   }

    //   // TODO: move create/update logic to service
    //   if (vm.customer._id) {
    //     vm.customer.$update(successCallback, errorCallback);
    //   } else {
    //     vm.customer.$save(successCallback, errorCallback);
    //   }

    //   function successCallback(res) {
    //     $state.go('categories.view', {
    //       categoryId: res._id
    //     });
    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }

}]);

  customerModule.directive('customerList', function(){
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'modules/customers/views/customer-list.template.html'
    };
});

