'use strict';

angular.module('core')
.directive('ccSpinner', function () {
	return {
		'restrict': 'AE',
		'templateUrl': 'modules/core/views/spinner.html',
		'scope': {
			'isLoading': '=',
			'message': '@'
		}
	};
}).factory('Notify', ['$rootScope', function($rootScope) {
    var notify = {};
    notify.msg = '';

    notify.sendbroadCast = function(mgs){
      this.msg = mgs;
      this.broadCast(mgs);
      //console.log(this.mgs);
    };

    notify.broadCast = function(msg){
        $rootScope.$broadcast('noError', msg);
    };

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    };

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
    // Usar el service '$resource' para devolver un objeto '$resource' Patients

}]).directive('selectOnClick', function () {
    // Linker function
    return function (scope, element, attrs) {
      element.bind('click', function () {
        this.select();
      });
    };
});