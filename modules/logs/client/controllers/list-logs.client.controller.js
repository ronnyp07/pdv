(function () {
  'use strict';

  angular
    .module('logs')
    .controller('LogsListController', LogsListController);

  LogsListController.$inject = ['LogsService'];

  function LogsListController(LogsService) {
    var vm = this;

    vm.logs = LogsService.query();
  }
})();
