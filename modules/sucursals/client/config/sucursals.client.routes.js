(function () {
  'use strict';

  angular
    .module('sucursals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sucursals', {
        abstract: true,
        url: '/sucursals',
        template: '<ui-view/>'
      })
      .state('sucursals.list', {
        url: '',
        templateUrl: 'modules/sucursals/views/list-sucursals.client.view.html',
        controller: 'SucursalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sucursals List'
        }
      })
      .state('sucursals.create', {
        url: '/create',
        templateUrl: 'modules/sucursals/views/form-sucursal.client.view.html',
        controller: 'SucursalsController',
        controllerAs: 'vm',
        resolve: {
          sucursalResolve: newSucursal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Sucursals Create'
        }
      })
      .state('sucursals.edit', {
        url: '/:sucursalId/edit',
        templateUrl: 'modules/sucursals/views/form-sucursal.client.view.html',
        controller: 'SucursalsUpdateController',
        controllerAs: 'vm',
        resolve: {
          sucursalResolve: getSucursal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sucursal {{ sucursalResolve.name }}'
        }
      })
      .state('sucursals.view', {
        url: '/:sucursalId',
        templateUrl: 'modules/sucursals/views/view-sucursal.client.view.html',
        controller: 'SucursalsController',
        controllerAs: 'vm',
        resolve: {
          sucursalResolve: getSucursal
        },
        data:{
          pageTitle: 'Sucursal {{ articleResolve.name }}'
        }
      });
  }

  getSucursal.$inject = ['$stateParams', 'SucursalsService'];

  function getSucursal($stateParams, SucursalsService) {
    return SucursalsService.get({
      sucursalId: $stateParams.sucursalId
    }).$promise;
  }

  newSucursal.$inject = ['SucursalsService'];

  function newSucursal(SucursalsService) {
    return new SucursalsService();
  }
})();
