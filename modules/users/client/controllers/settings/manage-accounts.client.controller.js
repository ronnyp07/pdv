'use strict';

angular.module('users').controller('AccountsController', ['$scope', '$http', 'Authentication', 'SucursalListServices',
  function ($scope, $http, Authentication, SucursalListServices) {
    var vm = this;
    $scope.user = Authentication.user;
    vm.sucursalList = SucursalListServices.query();
    console.log(vm.sucursalList);
    vm.userServices = {};
  }
]);
