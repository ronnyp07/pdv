'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication','LogsService','LogsRestServices', '$rootScope', 'PartnersService', 'CacheFactory',
  function ($scope, $state, $http, $location, $window, Authentication, LogsService, LogsRestServices, $rootScope, PartnersService, CacheFactory) {
    $scope.authentication = Authentication;
    $scope.logServices = LogsRestServices;
    $rootScope.nav = true;
    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    // if ($scope.authentication.user) {
    //   $location.path('/');
    // }

    $scope.signup = function () {
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        $scope.authentication.user = response;
        //$scope.authentication.companyCache.put = ('companyCache', {test: 'hola'});
         PartnersService.get(function(data){
           //$scope.authentication.company = CacheFactory('company', { storageMode: 'localStorage' });
           $scope.authentication.sucursalCache.put('company', data.results[0]);
           // $scope.authentication.company.put = ('company', data.results[0]);
           // console.log(data.results[0]);
         });
        $scope.logServices.getLogByUser($scope.authentication.user._id).then(function(data){
        $scope.logSession = data;
        if($scope.logSession.length <= 0){
          $scope.logServices.checkPosSession($scope.authentication.user._id).then(function(cajaturno){
               if(cajaturno.length > 0){
                $scope.authentication.cajaturno.put('cajaturno', cajaturno[0]);
               }else{
                $scope.authentication.cajaturno.remove('cajaturno');
               }
          });
        var log = new LogsService();
        log.name = $scope.authentication.user.displayName + moment().format("DDMMYY");
        log.createdDate = moment().format();
        log.createdUser = $scope.authentication.user._id;
        log.$save(function(data){
             $state.go('home');
        });
          }else{
            $state.go('home');
          }
        });
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      var redirect_to;

      if ($state.previous) {
        redirect_to = $state.previous.href;
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };
  }
]);
