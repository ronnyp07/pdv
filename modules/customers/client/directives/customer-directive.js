'use strict';
var customerModule = angular.module('customers');

customerModule.directive('customerCreate', ['$q', 'CustomersController', function($q, CustomersController){
  return{
       restrict: 'EA',
       templateUrl:'modules/customers/partials/customer-create.html'
  };
}]);