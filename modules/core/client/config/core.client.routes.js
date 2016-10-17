(function () {
  'use strict';

<<<<<<< HEAD
  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });
=======
// Setting up route
var app = angular.module('core');
app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
>>>>>>> lost_changes

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
<<<<<<< HEAD
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Not-Found'
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Bad-Request'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      });
  }
}());
=======
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


>>>>>>> lost_changes
