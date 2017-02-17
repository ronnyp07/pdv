(function () {
  'use strict';

  angular
    .module('roles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('roles', {
        abstract: true,
        url: '/roles',
        template: '<ui-view/>'
      })
      .state('roles.list', {
        url: '',
        templateUrl: 'modules/roles/views/list-roles.client.view.html',
        controller: 'RolesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Roles List'
        }
      })
      .state('roles.create', {
        url: '/create',
        templateUrl: 'modules/roles/client/views/form-role.client.view.html',
        controller: 'RolesController',
        controllerAs: 'vm',
        resolve: {
          roleResolve: newRole
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Roles Create'
        }
      })
      .state('roles.edit', {
        url: '/:roleId/edit',
        templateUrl: 'modules/roles/client/views/form-role.client.view.html',
        controller: 'RolesController',
        controllerAs: 'vm',
        resolve: {
          roleResolve: getRole
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Role {{ roleResolve.name }}'
        }
      })
      .state('roles.view', {
        url: '/:roleId',
        templateUrl: 'modules/roles/client/views/view-role.client.view.html',
        controller: 'RolesController',
        controllerAs: 'vm',
        resolve: {
          roleResolve: getRole
        },
        data:{
          pageTitle: 'Role {{ articleResolve.name }}'
        }
      });
  }

  getRole.$inject = ['$stateParams', 'RolesService'];

  function getRole($stateParams, RolesService) {
    return RolesService.get({
      roleId: $stateParams.roleId
    }).$promise;
  }

  newRole.$inject = ['RolesService'];

  function newRole(RolesService) {
    return new RolesService();
  }
})();
