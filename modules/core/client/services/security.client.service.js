'use strict';


var coreModule = angular.module('core');

coreModule.service('Security', ['Authentication','$state', function(Authentication, $state){
var self = {
   'auth': Authentication,
   'authCheck': function(){
   	 if(!self.auth.user){
        $state.go('authentication.signin');
   	 }
   }
};
self.authCheck();
return self;
}]);