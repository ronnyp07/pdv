(function () {
  'use strict';

  angular
    .module('logs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('logs', {
        abstract: true,
        url: '/logs',
        template: '<ui-view/>'
      })
      .state('logs.list', {
        url: '',
        templateUrl: 'modules/logs/client/views/list-logs.client.view.html',
        controller: 'LogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Logs List'
        }
      })
      .state('logs.create', {
        url: '/create',
        templateUrl: 'modules/logs/client/views/form-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: newLog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Logs Create'
        }
      })
      .state('logs.edit', {
        url: '/:logId/edit',
        templateUrl: 'modules/logs/client/views/form-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: getLog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Log {{ logResolve.name }}'
        }
      })
      .state('logs.view', {
        url: '/:logId',
        templateUrl: 'modules/logs/client/views/view-log.client.view.html',
        controller: 'LogsController',
        controllerAs: 'vm',
        resolve: {
          logResolve: getLog
        },
        data:{
          pageTitle: 'Log {{ articleResolve.name }}'
        }
      });
  }

  getLog.$inject = ['$stateParams', 'LogsService'];

  function getLog($stateParams, LogsService) {
    return LogsService.get({
      logId: $stateParams.logId
    }).$promise;
  }

  newLog.$inject = ['LogsService'];

  function newLog(LogsService) {
    return new LogsService();
  }
})();
