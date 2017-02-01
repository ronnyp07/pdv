(function () {
  'use strict';

  angular
    .module('creditpays')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('creditpays', {
        abstract: true,
        url: '/creditpays',
        template: '<ui-view/>'
      })
      .state('creditpays.list', {
        url: '',
        templateUrl: 'modules/creditpays/client/views/list-creditpays.client.view.html',
        controller: 'CreditpaysListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Creditpays List'
        }
      })
      .state('creditpays.create', {
        url: '/create',
        templateUrl: 'modules/creditpays/client/views/form-creditpay.client.view.html',
        controller: 'CreditpaysController',
        controllerAs: 'vm',
        resolve: {
          creditpayResolve: newCreditpay
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Creditpays Create'
        }
      })
      .state('creditpays.edit', {
        url: '/:creditpayId/edit',
        templateUrl: 'modules/creditpays/client/views/form-creditpay.client.view.html',
        controller: 'CreditpaysController',
        controllerAs: 'vm',
        resolve: {
          creditpayResolve: getCreditpay
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Creditpay {{ creditpayResolve.name }}'
        }
      })
      .state('creditpays.view', {
        url: '/:creditpayId',
        templateUrl: 'modules/creditpays/client/views/view-creditpay.client.view.html',
        controller: 'CreditpaysController',
        controllerAs: 'vm',
        resolve: {
          creditpayResolve: getCreditpay
        },
        data:{
          pageTitle: 'Creditpay {{ articleResolve.name }}'
        }
      });
  }

  getCreditpay.$inject = ['$stateParams', 'CreditpaysService'];

  function getCreditpay($stateParams, CreditpaysService) {
    return CreditpaysService.get({
      creditpayId: $stateParams.creditpayId
    }).$promise;
  }

  newCreditpay.$inject = ['CreditpaysService'];

  function newCreditpay(CreditpaysService) {
    return new CreditpaysService();
  }
})();
