(function () {
  'use strict';

  angular
    .module('lotes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lotes', {
        abstract: true,
        url: '/lotes',
        template: '<ui-view/>'
      })
      .state('lotes.list', {
        url: '',
        templateUrl: 'modules/lotes/client/views/list-lotes.client.view.html',
        controller: 'LotesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lotes List'
        }
      })
      .state('lotes.create', {
        url: '/create',
        templateUrl: 'modules/lotes/client/views/form-lote.client.view.html',
        controller: 'LotesController',
        controllerAs: 'vm',
        resolve: {
          loteResolve: newLote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Lotes Create'
        }
      })
      .state('lotes.edit', {
        url: '/:loteId/edit',
        templateUrl: 'modules/lotes/client/views/form-lote.client.view.html',
        controller: 'LotesController',
        controllerAs: 'vm',
        resolve: {
          loteResolve: getLote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Lote {{ loteResolve.name }}'
        }
      })
      .state('lotes.view', {
        url: '/:loteId',
        templateUrl: 'modules/lotes/client/views/view-lote.client.view.html',
        controller: 'LotesController',
        controllerAs: 'vm',
        resolve: {
          loteResolve: getLote
        },
        data:{
          pageTitle: 'Lote {{ articleResolve.name }}'
        }
      });
  }

  getLote.$inject = ['$stateParams', 'LotesService'];

  function getLote($stateParams, LotesService) {
    return LotesService.get({
      loteId: $stateParams.loteId
    }).$promise;
  }

  newLote.$inject = ['LotesService'];

  function newLote(LotesService) {
    return new LotesService();
  }
})();
