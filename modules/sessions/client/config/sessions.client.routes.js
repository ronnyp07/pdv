(function () {
  'use strict';

  angular
    .module('sessions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sessions', {
        abstract: true,
        url: '/sessions',
        template: '<ui-view/>'
      })
      .state('sessions.list', {
        url: '',
        templateUrl: 'modules/sessions/views/list-sessions.client.view.html',
        controller: 'SessionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sessions List'
        }
      })
      .state('sessions.create', {
        url: '/create',
        templateUrl: 'modules/sessions/views/form-session.client.view.html',
        controller: 'SessionsController',
        controllerAs: 'vm',
        resolve: {
          sessionResolve: newSession
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Sessions Create'
        }
      })
      .state('sessions.openSession', {
        url: '/openSession',
        templateUrl: 'modules/sessions/partials/opensession.html',
        controller: 'SessionsListController',
        controllerAs: 'vm',
        resolve: {
          sessionResolve: checkSession
        }
      })
      .state('sessions.edit', {
        url: '/:sessionId/edit',
        templateUrl: 'modules/sessions/client/views/form-session.client.view.html',
        controller: 'SessionsController',
        controllerAs: 'vm',
        resolve: {
          sessionResolve: getSession
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Session {{ sessionResolve.name }}'
        }
      }).state('sessions.cierre', {
        url: '/cierre',
        templateUrl: 'modules/sessions/views/cierre-session.client.view.html',
        controller: 'SessionsCierreController',
        controllerAs: 'vm'
      })
      .state('sessions.view', {
        url: '/:sessionId',
        templateUrl: 'modules/sessions/client/views/view-session.client.view.html',
        controller: 'SessionsController',
        controllerAs: 'vm',
        resolve: {
          sessionResolve: getSession
        },
        data:{
          pageTitle: 'Session {{ articleResolve.name }}'
        }
      });
  }

  getSession.$inject = ['$stateParams', 'SessionsService'];

  function getSession($stateParams, SessionsService) {
    return SessionsService.get({
      sessionId: $stateParams.sessionId
    }).$promise;
  }

  newSession.$inject = ['SessionsService', 'SessionRestServices'];

  function newSession(SessionsService) {
    return new SessionsService();
  }

  function checkSession(SessionRestServices) {
    return SessionRestServices;
  }
})();
