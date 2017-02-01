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
}).directive('menuLeft', function () {
    // Linker function
    return {
    'restrict': 'AE',
     link: function (scope, element, attrs) {
        console.log('run');
        var myElement = angular.element(document.querySelector( '#mainbody' ) );
        element.bind('click', function (e){
           myElement.toggleClass('sidebar-collapse');
      });
    }
   };
}).directive('uiManualTooltip', function ($tooltip) {
    // Linker function
    return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      scope.$watch(function (){
          return ngModel.$modelValue;
      }, function (v) {
          // if(elem.hasClass('shortCierre')){
          //      console.log('tiene clase');
          //     }else{
          //    console.log('no tiene clase');
          //   }
          //console.log('!!!' + v);
      });
    }
  };
    // return {
    //   'restrict': 'AE',
    //  //  'scope': {
    //  //    'message': '='
    //  // },
    //  'link': function (scope, element, attrs, form) {
    //       console.log(form);
    //       var ts = $tooltip(element, {
    //                     title: attrs.title,
    //                     animation: attrs.animation,
    //                     trigger: 'manual'
    //       });
    //       console.log(scope.message);
    //       scope.$watch(scope.message, function(value, old) {
    //                     console.log('value');
    //                     // whatever logic checking here you need to do
    //                     // if (form.$invalid)
    //                     //     ts.toggle();
    //                     // else
    //                     //     ts.hide();
    //       });
    //       // if(element.hasClass('shortCierre')){
    //       //     console.log('tiene clase');
    //       // }else{
    //       //   console.log('no tiene clase');
    //       // }
    //  }
    // };
});