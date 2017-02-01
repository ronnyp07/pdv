(function () {
  'use strict';

  angular
    .module('abonos')
    .controller('AbonosListController', AbonosListController);

  AbonosListController.$inject = ['AbonosService'];

  function AbonosListController(AbonosService) {
    var vm = this;

    vm.abonos = AbonosService.query();
  }
})();
