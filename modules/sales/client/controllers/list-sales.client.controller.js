(function () {
  'use strict';

  angular
    .module('sales')
    .controller('SalesListController', SalesListController);

  SalesListController.$inject = ['SalesService'];

  function SalesListController(SalesService) {
    var vm = this;

    vm.sales = SalesService.query();
  }
})();
