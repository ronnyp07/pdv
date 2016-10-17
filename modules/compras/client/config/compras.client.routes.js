(function () {
  'use strict';

  angular
    .module('compras')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('compras', {
        abstract: true,
        url: '/compras',
        template: '<ui-view/>'
      })
      .state('compras.list', {
        url: '',
        templateUrl: 'modules/compras/views/list-compra.client.view.html',
        controller: 'ComprasListController',
        controllerAs: 'vm',
        resolve: {
         compraResolve : setCompraStatus
        }
      })
      .state('compras.orders', {
        url: '/orders',
        templateUrl: 'modules/compras/views/list-ordenescompra.client.view.html',
        controller: 'ComprasOrdersController',
        controllerAs: 'vm',
        resolve: {
         compraResolve : setCompraStatus
        }
      })
      .state('compras.create', {
        url: '/create',
        templateUrl: 'modules/compras/views/form-compra.client.view.html',
        controller: 'ComprasController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Compras Create'
        }
      })
      .state('compras.edit', {
        url: '/:compraId/edit',
        templateUrl: 'modules/compras/client/views/form-compra.client.view.html',
        controller: 'ComprasController',
        controllerAs: 'vm',
        resolve: {
          compraResolve: getCompra
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Compra {{ compraResolve.name }}'
        }
      })
      .state('compras.view', {
        url: '/:compraId',
        templateUrl: 'modules/compras/client/views/view-compra.client.view.html',
        controller: 'ComprasController',
        controllerAs: 'vm',
        resolve: {
          compraResolve: getCompra
        },
        data:{
          pageTitle: 'Compra {{ articleResolve.name }}'
        }
      });
  }

  getCompra.$inject = ['$stateParams', 'ComprasService'];

  function getCompra($stateParams, ComprasService) {
    return ComprasService.get({
      compraId: $stateParams.compraId
    }).$promise;
  }

  newCompra.$inject = ['ComprasService'];

  function newCompra(ComprasService) {
    return new ComprasService();
  }

  newCompra.$inject = ['ComprasRestServices'];
  function setCompraStatus(ComprasRestServices) {
    return  ComprasRestServices;
  }
})();
