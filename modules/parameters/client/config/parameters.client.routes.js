(function () {
  'use strict';

  angular
    .module('parameters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('parameters', {
        abstract: true,
        url: '/parameters',
        template: '<ui-view/>'
      })
      .state('parameters.list', {
        url: '',
        templateUrl: 'modules/parameters/views/list-parameters.client.view.html',
        controller: 'ParametersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Parameters List'
        }
      })
      .state('parameters.create', {
        url: '/create',
        templateUrl: 'modules/parameters/client/views/form-parameter.client.view.html',
        controller: 'ParametersController',
        controllerAs: 'vm',
        resolve: {
          parameterResolve: newParameter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Parameters Create'
        }
      })
      .state('parameters.edit', {
        url: '/:parameterId/edit',
        templateUrl: 'modules/parameters/client/views/form-parameter.client.view.html',
        controller: 'ParametersController',
        controllerAs: 'vm',
        resolve: {
          parameterResolve: getParameter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Parameter {{ parameterResolve.name }}'
        }
      })
      .state('parameters.view', {
        url: '/:parameterId',
        templateUrl: 'modules/parameters/client/views/view-parameter.client.view.html',
        controller: 'ParametersController',
        controllerAs: 'vm',
        resolve: {
          parameterResolve: getParameter
        },
        data:{
          pageTitle: 'Parameter {{ articleResolve.name }}'
        }
      });
  }

  getParameter.$inject = ['$stateParams', 'ParametersService'];

  function getParameter($stateParams, ParametersService) {
    return ParametersService.get({
      parameterId: $stateParams.parameterId
    }).$promise;
  }

  newParameter.$inject = ['ParametersService'];

  function newParameter(ParametersService) {
    return new ParametersService();
  }
})();
