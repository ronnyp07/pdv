(function () {
  'use strict';

  angular
    .module('ncfs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ncfs', {
        abstract: true,
        url: '/ncfs',
        template: '<ui-view/>'
      })
      .state('ncfs.list', {
        url: '',
        templateUrl: 'modules/ncfs/views/list-ncfs.client.view.html',
        controller: 'NcfsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ncfs List'
        }
      })
      .state('ncfs.create', {
        url: '/create',
        templateUrl: 'modules/ncfs/views/form-ncf.client.view.html',
        controller: 'NcfsController',
        controllerAs: 'vm',
        resolve: {
          ncfResolve: newNcf
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Ncfs Create'
        }
      })
      .state('ncfs.edit', {
        url: '/:ncfId/edit',
        templateUrl: 'modules/ncfs/client/views/form-ncf.client.view.html',
        controller: 'NcfsController',
        controllerAs: 'vm',
        resolve: {
          load: getNcf
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ncf {{ ncfResolve.name }}'
        }
      })
      .state('ncfs.view', {
        url: '/:ncfId',
        templateUrl: 'modules/ncfs/client/views/view-ncf.client.view.html',
        controller: 'NcfsController',
        controllerAs: 'vm',
        resolve: {
          ncfResolve: getNcf
        },
        data:{
          pageTitle: 'Ncf {{ articleResolve.name }}'
        }
      });
  }

  getNcf.$inject = ['$stateParams', 'NcfsService', 'Authentication', '$q', 'NcfsRestServices'];

  function getNcf($stateParams, NcfsService, Authentication, $q, NcfsRestServices) {
    return NcfsRestServices.getNcfFilter().$promise;
  }

  function getProduct($stateParams, productsService, $q) {
    var defer = $q.defer();
    productsService.get({
      productId: $stateParams.productId
    }, function(data){
     defer.resolve(data);
    });
    return defer.promise;
  }

  newNcf.$inject = ['NcfsService'];

  function newNcf(NcfsService) {
    return new NcfsService();
  }
})();
