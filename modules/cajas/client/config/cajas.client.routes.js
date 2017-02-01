(function () {
  'use strict';

  angular
    .module('cajas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cajas', {
        abstract: true,
        url: '/cajas',
        template: '<ui-view/>'
      })
      .state('cajas.list', {
        url: '',
        templateUrl: 'modules/cajas/views/list-cajas.client.view.html',
        controller: 'CajasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cajas List'
        }
      })
      .state('cajas.create', {
        url: '/create',
        templateUrl: 'modules/cajas/views/form-caja.client.view.html',
        controller: 'CajasController',
        controllerAs: 'vm',
        resolve: {
          cajaResolve: newCaja
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Cajas Create'
        }
      })
      .state('cajas.edit', {
        url: '/:cajaId/edit',
        templateUrl: 'modules/cajas/views/form-caja.client.view.html',
        controller: 'CajasController',
        controllerAs: 'vm',
        resolve: {
          cajaResolve: getCaja
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Caja {{ cajaResolve.name }}'
        }
      })
      .state('cajas.view', {
        url: '/:cajaId',
        templateUrl: 'modules/cajasviews/view-caja.client.view.html',
        controller: 'CajasController',
        controllerAs: 'vm',
        resolve: {
          cajaResolve: getCaja
        },
        data:{
          pageTitle: 'Caja {{ articleResolve.name }}'
        }
      });
  }

  getCaja.$inject = ['$stateParams', 'CajasService'];

  function getCaja($stateParams, CajasService) {
    return CajasService.get({
      cajaId: $stateParams.cajaId
    }).$promise;
  }

  newCaja.$inject = ['CajasService'];

  function newCaja(CajasService) {
    return new CajasService();
  }
})();
