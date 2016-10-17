(function () {
  'use strict';

<<<<<<< HEAD
  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator'];

  function AuthenticationController($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;

=======
angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication','LogsService','LogsRestServices', '$rootScope',
  function ($scope, $state, $http, $location, $window, Authentication, LogsService, LogsRestServices, $rootScope) {
    $scope.authentication = Authentication;
    $scope.logServices = LogsRestServices;
    $rootScope.nav = true;
>>>>>>> lost_changes
    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
<<<<<<< HEAD
    if (vm.authentication.user) {
      $location.path('/');
    }
=======
    // if ($scope.authentication.user) {
    //   $location.path('/');
    // }
>>>>>>> lost_changes

    function signup(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
      });
    }

<<<<<<< HEAD
    function signin(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
=======
    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        $scope.authentication.user = response;
        $scope.logServices.getLogByUser($scope.authentication.user._id).then(function(data){
        $scope.logSession = data;
        if($scope.logSession.length <= 0){
          $scope.logServices.checkPosSession($scope.authentication.user._id).then(function(session){
               if(session.length > 0){
                $scope.authentication.session.put('session', session[0]);
               }else{
                $scope.authentication.session.remove('session');
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
>>>>>>> lost_changes
      });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
}());
