(function () {
  'use strict';

  angular
    .module('turnocajas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('turnocajas', {
        abstract: true,
        url: '/turnocajas',
        template: '<ui-view/>'
      })
      .state('turnocajas.list', {
        url: '',
        templateUrl: 'modules/turnocajas/client/views/list-turnocajas.client.view.html',
        controller: 'TurnocajasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Turnocajas List'
        }
      })
      .state('turnocajas.create', {
        url: '/create',
        templateUrl: 'modules/turnocajas/client/views/form-turnocaja.client.view.html',
        controller: 'TurnocajasController',
        controllerAs: 'vm',
        resolve: {
          turnocajaResolve: newTurnocaja
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Turnocajas Create'
        }
      })
      .state('turnocajas.edit', {
        url: '/:turnocajaId/edit',
        templateUrl: 'modules/turnocajas/client/views/form-turnocaja.client.view.html',
        controller: 'TurnocajasController',
        controllerAs: 'vm',
        resolve: {
          turnocajaResolve: getTurnocaja
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Turnocaja {{ turnocajaResolve.name }}'
        }
      })
      .state('turnocajas.view', {
        url: '/:turnocajaId',
        templateUrl: 'modules/turnocajas/client/views/view-turnocaja.client.view.html',
        controller: 'TurnocajasController',
        controllerAs: 'vm',
        resolve: {
          turnocajaResolve: getTurnocaja
        },
        data:{
          pageTitle: 'Turnocaja {{ articleResolve.name }}'
        }
      });
  }

  getTurnocaja.$inject = ['$stateParams', 'TurnocajasService'];

  function getTurnocaja($stateParams, TurnocajasService) {
    return TurnocajasService.get({
      turnocajaId: $stateParams.turnocajaId
    }).$promise;
  }

  newTurnocaja.$inject = ['TurnocajasService'];

  function newTurnocaja(TurnocajasService) {
    return new TurnocajasService();
  }
})();
