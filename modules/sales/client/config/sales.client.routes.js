(function () {
  'use strict';

  angular
    .module('sales')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sales', {
        abstract: true,
        url: '/sales',
        template: '<ui-view/>'
      })
      .state('sales.list', {
        url: '',
        templateUrl: 'modules/sales/client/views/list-sales.client.view.html',
        controller: 'SalesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sales List'
        }
      })
      .state('sales.create', {
        url: '/create',
        templateUrl: 'modules/sales/client/views/form-sale.client.view.html',
        controller: 'SalesController',
        controllerAs: 'vm',
        // resolve: {
        //   saleResolve: newSale
        // },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Sales Create'
        }
      }).state('sales.pos', {
        url: '/pos',
        templateUrl: 'modules/sales/views/form-pos-sale.client.view.html',
        controller: 'SalesController',
        controllerAs: 'vm',
        resolve: {
            SalesRestServices: 'SalesRestServices',
                // A function value resolves to the return
                // value of the function
            sales: function(SalesRestServices){
                    return SalesRestServices;
            }
        }
      })
      .state('sales.edit', {
        url: '/:saleId/edit',
        templateUrl: 'modules/sales/client/views/form-sale.client.view.html',
        controller: 'SalesController',
        controllerAs: 'vm',
        resolve: {
          saleResolve: getSale
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sale {{ saleResolve.name }}'
        }
      })
      .state('sales.view', {
        url: '/:saleId',
        templateUrl: 'modules/sales/client/views/view-sale.client.view.html',
        controller: 'SalesController',
        controllerAs: 'vm',
        resolve: {
          saleResolve: getSale
        },
        data:{
          pageTitle: 'Sale {{ articleResolve.name }}'
        }
      });
  }

  getSale.$inject = ['$stateParams', 'SalesService'];

  function getSale($stateParams, SalesService) {
    return SalesService.get({
      saleId: $stateParams.saleId
    }).$promise;
  }

  newSale.$inject = ['SalesRestService'];
  function newSale(SalesRestService) {
    return SalesRestService;
  }

  // getInit.$inject = ['SalesRestServices'];
  // function getInit(SalesRestServices) {
  //   return  SalesRestService;
  // }
})();
