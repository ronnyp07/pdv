(function () {
  'use strict';

  angular
    .module('inventarios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inventarios', {
        abstract: true,
        url: '/inventarios',
        template: '<ui-view/>'
      })
      .state('inventarios.list', {
        url: '',
        templateUrl: 'modules/inventarios/views/list-inventarios.client.view.html',
        controller: 'InventariosListController',
        controllerAs: 'vm'
      })
      .state('inventarios.create', {
        url: '/create',
        templateUrl: 'modules/inventarios/views/form-inventario.client.view.html',
        controller: 'InventariosController',
        controllerAs: 'vm'
      })
      .state('inventarios.edit', {
        url: '/:inventarioId/edit',
        templateUrl: 'modules/inventarios/views/form-inventario.client.view.html',
        controller: 'InventariosUpdateController',
        controllerAs: 'vm'
      });
  }

  getInventario.$inject = ['$stateParams', 'InventariosService'];

  function getInventario($stateParams, InventariosService) {
    return InventariosService.get({
      inventarioId: $stateParams.inventarioId
    }).$promise;
  }

  newInventario.$inject = ['InventariosService'];

  function newInventario(InventariosService) {
    return new InventariosService();
  }
})();
