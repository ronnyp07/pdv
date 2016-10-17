(function () {
  'use strict';

<<<<<<< HEAD
  angular
    .module('core.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
=======
// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {


>>>>>>> lost_changes
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
}());
