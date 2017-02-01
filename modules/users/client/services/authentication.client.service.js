'use strict';

// Authentication service for user variables
var userModule = angular.module('users');
userModule.factory('Authentication', ['$window', 'CacheFactory',
	function ($window, CacheFactory) {
		var auth = {
			user: $window.user,
      hideNavBar : false,
      sucursalIndo: null,
			sucursal: null,
			selectedSucural: null,
      companyCache: CacheFactory('companyCache', { storageMode: 'localStorage'}),
			cajaturno: CacheFactory('cajaturno', { storageMode: 'localStorage' }),
			sucursalCache: CacheFactory('sucursal', { storageMode: 'localStorage' }),
			'filterMenu' : function(param){
				var hasAccess = false;
				auth.sucursal = auth.sucursalCache.get('sucursal');
               if(auth.sucursal === 'superUser'){
                 hasAccess = true;
               }else{
				_.find(auth.sucursal.permision, function(o){
					if(param === o){
						hasAccess = true;
					}
				});
			}
			return hasAccess;
		  },
      sessionCheck : function(param){

      },'loadSucursal' : function(){
        var sucursal = auth.sucursalCache.get('sucursal');
        auth.sucursalInfo  = sucursal !=='superUser' ? sucursal.sucursalId._id: 'superUser';
        //auth.sucursalList =

      }
		};

    auth.loadSucursal();
		return auth;
	}
]);


userModule.factory('socketio',['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
