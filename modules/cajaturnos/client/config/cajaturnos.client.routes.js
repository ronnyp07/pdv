(function () {
  'use strict';

  angular
    .module('cajaturno')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cajaturno', {
        abstract: true,
        url: '/cajaturno',
        template: '<ui-view/>'
      })
      .state('cajaturno.list', {
        url: '',
        templateUrl: 'modules/cajaturnos/views/list-cajaturno.client.view.html',
        controller: 'CajaturnoListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cajaturno List'
        }
      })
      .state('cajaturno.create', {
        url: '/create',
        templateUrl: 'modules/cajaturnos/views/form-cajaturno.client.view.html',
        controller: 'CajaturnoController',
        controllerAs: 'vm'

        // ,
        // resolve: {
        //   cajaturnoResolve: newCajaturno
        // },
        // data: {
        //   roles: ['user', 'admin'],
        //   pageTitle : 'Cajaturno Create'
        // }
      })
      .state('cajaturno.opencajaturno', {
        url: '/opencajaturno',
        templateUrl: 'modules/cajaturnos/partials/opencajaturno.html',
        controller: 'CajaturnoListController',
        controllerAs: 'vm',
        resolve: {
          cajaturnoResolve: checkCajaturno
        }
      })
      .state('cajaturno.edit', {
        url: '/:cajaturnoId/edit',
        templateUrl: 'modules/cajaturnos/client/views/form-cajaturno.client.view.html',
        controller: 'CajaturnoController',
        controllerAs: 'vm',
        resolve: {
          cajaturnoResolve: getCajaturno
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cajaturno {{ cajaturnoResolve.name }}'
        }
      }).state('cajaturno.cierre', {
        url: '/cierre',
        templateUrl: 'modules/cajaturnos/views/cierre-cajaturno.client.view.html',
        controller: 'CajaturnoCierreController',
        controllerAs: 'vm'
      })
      .state('cajaturno.view', {
        url: '/:cajaturnoId',
        templateUrl: 'modules/cajaturnos/client/views/view-cajaturno.client.view.html',
        controller: 'CajaturnoController',
        controllerAs: 'vm',
        resolve: {
          cajaturnoResolve: getCajaturno
        },
        data:{
          pageTitle: 'Cajaturno {{ articleResolve.name }}'
        }
      });
  }

  getCajaturno.$inject = ['$stateParams', 'CajaturnoService'];

  function getCajaturno($stateParams, CajaturnoService) {
    return CajaturnoService.get({
      cajaturnoId: $stateParams.cajaturnoId
    }).$promise;
  }

  newCajaturno.$inject = ['CajaturnoService', 'CajaturnoRestServices'];

  function newCajaturno(CajaturnoService) {
    return new CajaturnoService();
  }

  function checkCajaturno(CajaturnoRestServices) {
    return CajaturnoRestServices;
  }
})();
