(function () {
  'use strict';

  angular
    .module('turnocajas')
    .controller('TurnocajasListController', TurnocajasListController);

  TurnocajasListController.$inject = ['TurnocajasService'];

  function TurnocajasListController(TurnocajasService) {
    var vm = this;

    vm.turnocajas = TurnocajasService.query();
  }
})();
