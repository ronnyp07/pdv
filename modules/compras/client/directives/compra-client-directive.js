'use strict';

angular.module('compras')
   .directive('compraList', function(){
   return {
     restrict: 'AE',
     templateUrl: 'modules/compras/partials/compra-list-detail.html'
   };
 });

