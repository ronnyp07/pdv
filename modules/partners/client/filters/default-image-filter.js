'use strict';
 var app = angular.module('partners');

 app.filter('defaultImage', function() {
 	   return function(input, param){
 	   	  if(!input){
 	   	  	return param;
 	   	  }
          return input;
 	   };
 });