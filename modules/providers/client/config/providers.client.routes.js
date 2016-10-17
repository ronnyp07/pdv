(function () {
  'use strict';

  angular
    .module('providers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('providers', {
        abstract: true,
        url: '/providers',
        template: '<ui-view/>'
      })
      .state('providers.list', {
        url: '',
        templateUrl: 'modules/providers/views/list-providers.client.view.html',
        controller: 'ProvidersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Providers List'
        }
      })
      .state('providers.create', {
        url: '/create',
        templateUrl: 'modules/providers/client/views/form-provider.client.view.html',
        controller: 'ProvidersController',
        controllerAs: 'vm',
        resolve: {
          providerResolve: newProvider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Providers Create'
        }
      })
      .state('providers.edit', {
        url: '/:providerId/edit',
        templateUrl: 'modules/providers/client/views/form-provider.client.view.html',
        controller: 'ProvidersController',
        controllerAs: 'vm',
        resolve: {
          providerResolve: getProvider
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Provider {{ providerResolve.name }}'
        }
      })
      .state('providers.view', {
        url: '/:providerId',
        templateUrl: 'modules/providers/client/views/view-provider.client.view.html',
        controller: 'ProvidersController',
        controllerAs: 'vm',
        resolve: {
          providerResolve: getProvider
        },
        data:{
          pageTitle: 'Provider {{ articleResolve.name }}'
        }
      });
  }

  getProvider.$inject = ['$stateParams', 'ProvidersService'];

  function getProvider($stateParams, ProvidersService) {
    return ProvidersService.get({
      providerId: $stateParams.providerId
    }).$promise;
  }

  newProvider.$inject = ['ProvidersService'];

  function newProvider(ProvidersService) {
    return new ProvidersService();
  }
})();
