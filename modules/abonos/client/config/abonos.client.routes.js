(function () {
  'use strict';

  angular
    .module('abonos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('abonos', {
        abstract: true,
        url: '/abonos',
        template: '<ui-view/>'
      })
      .state('abonos.list', {
        url: '',
        templateUrl: 'modules/abonos/client/views/list-abonos.client.view.html',
        controller: 'AbonosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Abonos List'
        }
      })
      .state('abonos.create', {
        url: '/create',
        templateUrl: 'modules/abonos/client/views/form-abono.client.view.html',
        controller: 'AbonosController',
        controllerAs: 'vm',
        resolve: {
          abonoResolve: newAbono
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Abonos Create'
        }
      })
      .state('abonos.edit', {
        url: '/:abonoId/edit',
        templateUrl: 'modules/abonos/client/views/form-abono.client.view.html',
        controller: 'AbonosController',
        controllerAs: 'vm',
        resolve: {
          abonoResolve: getAbono
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Abono {{ abonoResolve.name }}'
        }
      })
      .state('abonos.view', {
        url: '/:abonoId',
        templateUrl: 'modules/abonos/client/views/view-abono.client.view.html',
        controller: 'AbonosController',
        controllerAs: 'vm',
        resolve: {
          abonoResolve: getAbono
        },
        data:{
          pageTitle: 'Abono {{ articleResolve.name }}'
        }
      });
  }

  getAbono.$inject = ['$stateParams', 'AbonosService'];

  function getAbono($stateParams, AbonosService) {
    return AbonosService.get({
      abonoId: $stateParams.abonoId
    }).$promise;
  }

  newAbono.$inject = ['AbonosService'];

  function newAbono(AbonosService) {
    return new AbonosService();
  }
})();
