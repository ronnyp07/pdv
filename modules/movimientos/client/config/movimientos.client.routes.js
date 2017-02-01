(function () {
  'use strict';

  angular
    .module('movimientos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('movimientos', {
        abstract: true,
        url: '/movimientos',
        template: '<ui-view/>'
      })
      .state('movimientos.list', {
        url: '',
        templateUrl: 'modules/movimientos/client/views/list-movimientos.client.view.html',
        controller: 'MovimientosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Movimientos List'
        }
      })
      .state('movimientos.create', {
        url: '/create',
        templateUrl: 'modules/movimientos/client/views/form-movimiento.client.view.html',
        controller: 'MovimientosController',
        controllerAs: 'vm',
        resolve: {
          movimientoResolve: newMovimiento
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Movimientos Create'
        }
      })
      .state('movimientos.edit', {
        url: '/:movimientoId/edit',
        templateUrl: 'modules/movimientos/client/views/form-movimiento.client.view.html',
        controller: 'MovimientosController',
        controllerAs: 'vm',
        resolve: {
          movimientoResolve: getMovimiento
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Movimiento {{ movimientoResolve.name }}'
        }
      })
      .state('movimientos.view', {
        url: '/:movimientoId',
        templateUrl: 'modules/movimientos/client/views/view-movimiento.client.view.html',
        controller: 'MovimientosController',
        controllerAs: 'vm',
        resolve: {
          movimientoResolve: getMovimiento
        },
        data:{
          pageTitle: 'Movimiento {{ articleResolve.name }}'
        }
      });
  }

  getMovimiento.$inject = ['$stateParams', 'MovimientosService'];

  function getMovimiento($stateParams, MovimientosService) {
    return MovimientosService.get({
      movimientoId: $stateParams.movimientoId
    }).$promise;
  }

  newMovimiento.$inject = ['MovimientosService'];

  function newMovimiento(MovimientosService) {
    return new MovimientosService();
  }
})();
