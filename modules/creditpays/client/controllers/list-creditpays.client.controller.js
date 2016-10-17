(function () {
  'use strict';

  angular
    .module('creditpays')
    .controller('CreditpaysListController', CreditpaysListController);

  CreditpaysListController.$inject = ['CreditpaysService'];

  function CreditpaysListController(CreditpaysService) {
    var vm = this;

    vm.creditpays = CreditpaysService.query();
  }
})();
