(function () {
  'use strict';

  angular
    .module('partners')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partners', {
        abstract: true,
        url: '/partners',
        template: '<ui-view/>'
      })
      .state('partners.list', {
        url: '',
        templateUrl: 'modules/partners/views/list-partners.client.view.html',
        controller: 'PartnersListController',
        controllerAs: 'vm',
        resolve: {
           resolveCore: securityPage
        },
        data: {
          pageTitle: 'Partners List'
        }
      })
      .state('partners.create', {
        url: '/create',
        templateUrl: 'modules/partners/views/form-partner.client.view.html',
        controller: 'PartnersController',
        controllerAs: 'vm',
        resolve: {
          partnerResolve: newPartner
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Partners Create'
        }
      })
      .state('partners.edit', {
        url: '/:partnerId/edit',
        templateUrl: 'modules/partners/views/form-partner.client.view.html',
        controller: 'PartnersUpdateController',
        controllerAs: 'vm',
        resolve: {
          partnerResolve: getPartner
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Partner {{ partnerResolve.name }}'
        }
      })
      .state('partners.view', {
        url: '/:partnerId',
        templateUrl: 'modules/partners/views/view-partner.client.view.html',
        controller: 'PartnersController',
        controllerAs: 'vm',
        resolve: {
          partnerResolve: getPartner
        },
        data:{
          pageTitle: 'Partner {{ articleResolve.name }}'
        }
      });
  }

  getPartner.$inject = ['$stateParams', 'PartnersService'];

  function getPartner($stateParams, PartnersService) {
    return PartnersService.get({
      partnerId: $stateParams.partnerId
    }).$promise;
  }

  newPartner.$inject = ['PartnersService'];

  function newPartner(PartnersService) {
    return new PartnersService();
  }

 securityPage.$inject = ['PartnersRestServices'];
    function securityPage(PartnersRestServices) {
      return  PartnersRestServices;
 }
})();
