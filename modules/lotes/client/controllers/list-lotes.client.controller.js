(function () {
  'use strict';

  angular
    .module('lotes')
    .controller('LotesListController', LotesListController);

  LotesListController.$inject = ['LotesService'];

  function LotesListController(LotesService) {
    var vm = this;

    vm.lotes = LotesService.query();
  }
})();
