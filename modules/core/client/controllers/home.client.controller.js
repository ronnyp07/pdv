'use strict';

var appCore = angular.module('core');

appCore.controller('HomeController', ['$scope', 'Authentication', 'Admin', '$state', '$window', 'CacheFactory', 'resolveCore', 'PartnersService',
  function ($scope, Authentication, Admin, $state, $window, CacheFactory, resolveCore, PartnersService) {
  	resolveCore.authCheck();
    var vm = this;
    // This provides Authentication context.
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.user = Admin.get({userId: vm.authentication.user._id});
    vm.setSucursal = function(sucursal){
      $window.sucursalInfo = sucursal;
      //console.log(vm.authentication.company.get('company'));
      // vm.authentication.company =
      vm.authentication.sucursalCache.put('sucursal', sucursal);
      $state.go('dashboards');
    };
 }
 ]);

appCore.directive('pageTop', function(){
  return{
   restrict: 'AE',
   transclude: true,
   templateUrl: 'modules/core/views/header.top.template.html'
 };
});