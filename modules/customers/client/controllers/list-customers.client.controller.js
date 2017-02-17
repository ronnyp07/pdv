
'use strict';

  // CustomersListController controller
  var customerModule = angular.module('customers');
  customerModule.controller('CustomersListController',
    ['$scope',
    '$state',
    'Authentication',
    'NgTableParams',
    'CustomerRestServices',
    'CustomersListService',
    'CustomersService',
    '$http',
    '$q',
    '$modal',
    function CustomersListController(
      $scope,
      $state,
      Authentication,
      NgTableParams,
      CustomerRestServices,
      CustomersListService,
      CustomersService,
      $http,
      $q,
      $modal
      ){

      var vm = this;
      vm.services = CustomerRestServices;
    // vm.customerServices.customerPaginationList();
    vm.imageURL = 'modules/users/img/profile/default.png';
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;

    var params = {
      page: 1,
      count: 3
    };

    var settings = {
     filterDelay: 300,
     total: 0,
     getData: function(params) {
      return CustomersService.get(params.url()).$promise.then(function(data) {
        $scope.total = data.total;
        params.total(data.total);
        return data.results;
      });
    }
  };

  vm.save = function(){
    if(vm.services.saveMode === 'create'){
      vm.services.customer.user = vm.authentication._id;
      vm.services.create(vm.services.customer).then(function(){
        vm.createModal.hide();
        $scope.tableParams.reload();
        alertify.success('Acción realizada exitosamente!!');
        vm.services.saveMode = '';
      });
    }

    if(vm.services.saveMode === 'update'){
      console.log(vm.services.customer);
      vm.services.updatecustomer(vm.services.customer).then(function(){
        vm.createModal.hide();
        $scope.tableParams.reload();
        alertify.success('Acción realizada exitosamente!!');
        vm.services.saveMode = '';
      });
    }
  };

  vm.delete = function(customer){
    vm.services.delete(customer).then(function(){
      $scope.tableParams.reload();
      alertify.success('Acción realizada exitosamente!!');
    });
  };

  vm.showCreateModal = function(saveParam){

    if(!saveParam){
     vm.services.customer = {};
     vm.services.saveMode = 'create';
     vm.services.customer.price = 'uno';
   }else{
     vm.services.saveMode = 'update';
     vm.services.customer = saveParam;
   }

   vm.createModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/customers/partials/template.savemodel.tpl.html',
     show: true
             // placement: 'center'
           });

 };

 /* jshint ignore:start */
 $scope.tableParams = new NgTableParams({}, settings);


}]);
