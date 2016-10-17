(function () {
  'use strict';

  angular
    .module('dashboards')
    .controller('DashboardsListController', DashboardsListController);

  DashboardsListController.$inject = ['DashboardsService', 'Authentication', '$window'];

  function DashboardsListController(DashboardsService, Authentication, $window) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    console.log(vm.authentication.filterMenu('Comprs'));
    vm.dashboards = DashboardsService.query();
    console.log(vm.authentication.sucursalCache.get('sucursal'));
   // vm.filterLinks = function(param){
   //   var isValid = false;
   //   _.find(vm.authentication.sucursal.permision, function(o){
   //   if(o === param){
   //      isValid = true;
   //       }
   //    }
   //  );
   //   return isValid;
   // };


   // console.log(vm.filterLinks('Comp'));
  }
})();
