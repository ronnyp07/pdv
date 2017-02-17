//Roles service used to communicate Roles REST endpoints
(function () {
  'use strict';

  angular
    .module('roles')
    .factory('RolesService', RolesService);

  RolesService.$inject = ['$resource'];

  function RolesService($resource) {
    return $resource('api/roles/:roleId', {
      roleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
