(function () {
  'use strict';

  angular
    .module('dashboards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboards', {
        url: '/dashboards',
        templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html',
        controller: 'DashboardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboards List'
        }
      })
      .state('dashboards.list', {
        url: '',
        templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html',
        controller: 'DashboardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboards List'
        }
      })
      .state('dashboards.create', {
        url: '/create',
        templateUrl: 'modules/dashboards/views/form-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: newDashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Dashboards Create'
        }
      })
      .state('dashboards.edit', {
        url: '/:dashboardId/edit',
        templateUrl: 'modules/dashboards/views/form-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: getDashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dashboard {{ dashboardResolve.name }}'
        }
      })
      .state('dashboards.view', {
        url: '/:dashboardId',
        templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: getDashboard
        },
        data:{
          pageTitle: 'Dashboard {{ articleResolve.name }}'
        }
      });
  }

  getDashboard.$inject = ['$stateParams', 'DashboardsService'];

  function getDashboard($stateParams, DashboardsService) {
    return DashboardsService.get({
      dashboardId: $stateParams.dashboardId
    }).$promise;
  }

  newDashboard.$inject = ['DashboardsService'];

  function newDashboard(DashboardsService) {
    return new DashboardsService();
  }
})();
