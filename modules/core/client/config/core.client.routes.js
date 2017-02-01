'use strict';

// Setting up route
var app = angular.module('core');
app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html',
      controller: 'HomeController',
      controllerAs: 'vm',
      resolve: {
        resolveCore: securityPage
      }
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/views/404.client.view.html'
    }).
    state('login', {
      url: '/login',
      templateUrl: 'modules/core/views/404.client.view.html'
    });

    securityPage.$inject = ['Security'];
    function securityPage(Security) {
      return  Security;
    }
  }
  ]);

app.config(['laddaProvider', 'VKI_CONFIG', function (laddaProvider, VKI_CONFIG) {
 laddaProvider.setOption({
  style: 'expand-right'
});

VKI_CONFIG.layout['Numerico'] = {
          'name': 'Numerico', 'keys': [
          [['1', '1'], ['2', '2'], ['3', '3'], ['← Bksp ', 'Bksp']],
          [['4', '4'], ['5', '5'], ['6', '6'], ['↵ Enter', 'Enter']],
          [['7', '7'], ['8', '8'], ['9', '9'], ['     .      ', '.']],
          [['      0     ', '0'],            ['     ,      ', ',']]
        ], 'lang': ['pt-BR-num'] };
}]);


