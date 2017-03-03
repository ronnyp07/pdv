'use strict';

var salesModule = angular.module('sales');

salesModule.filter('precio', function() {
   return function (input, param) {
         var precios = [];
         angular.forEach(_.orderBy(input, ['no'], ['asc']), function(item){
             if(item.pVenta > 0){
                precios.push(item);
             }
         });
         return  precios;
		// if (!input) {

		// 	return param;
		// }
	};
});