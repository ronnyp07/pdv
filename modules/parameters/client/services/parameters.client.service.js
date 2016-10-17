//Parameters service used to communicate Parameters REST endpoints
(function () {
  'use strict';

  var parametersModule = angular.module('parameters');
  parametersModule.factory('parametersService', parametersService);

  parametersService.$inject = ['$resource'];

  function parametersService($resource) {
    return $resource('api/parameters/:parameterId', {
      parameterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET' }
    });
  }

  parametersModule.service('ParameterRestServices',  ['$q', '$http', '$timeout', 'parametersService', function($q, $http, $timeout, parametersService){
    var self ={
     'parameters': [],
     'paramEnum':{
       inventoryStatus: {
         por_validar: 'Por Validar',
         activo: 'Activo',
         cerrado: 'Cerrado'
       },
       headers: {
         tipo_factura : 'Tipo Factura',
         tipo_pago: 'Tipo Pago',
         tipo_sales_pago: 'Ventas Tipo Pago'
       },
       details: {
          tipo_factura_factura : 'FACTURA',
          tipo_pago_efectivo : 'CONTADO',
          tipo_sales_pago_efectivo: 'EFECTIVO',
          tipo_sales_pago_tarjeta: 'TARJETA',
          tipo_sales_pago_vales: 'VALES',
          tipo_sales_pago_tran: 'TRANSFERENCIA',
          tipo_sales_pago_cheque: 'CHEQUE',
          tipo_sales_pago_credito: 'CREDITO',
          sales_status_espera: 'ESPERA',
          compra_status_pendiente : 'PENDIENTE',
          compra_status_pagado : 'PAGADO',
          compra_status_entrada : 'RECIBIDO',
          tipo_movimiento_ac : 'AC'
       }
     },
     'tempAncestors': [],
     'tempParent': null,
     'parameter': null,
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'count': 25,
     'ordering': null,
     'category': null,
     'children': [],
     'search': '',
     'isSaving': false,
     'isLoading': false,
     'carList': [],
     'getParamsFilter': function(val){
      var data = {
        lastName: val
      };
      var result = [];
      var deferred =  $q.defer();
      $http.post('/api/parameterfilter', data)
      .success(function(response) {
        angular.forEach(response, function(card) {
          result.push(card);
        });
        return deferred.resolve(result);
      })
      .error(function(){
        /* error handling */
      });
      return deferred.promise;
    },
    'loadparameters': function(){

    },'categoryTree': function(param){
      parametersService.get({parameterId: param}, function(data){
           self.category = data;
           self.getParamsFilterByParent(null, data._id).then(function(result){
             self.children = result;
           });
      });
    },getParamsFilterByParent: function(val, parent){
      var data = {
        id: val,
        param : parent
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/parameterfilterByParent', data)
      .success(function(response) {
        angular.forEach(response, function(card) {
          result.push(card);
        });
        return deferred.resolve(result);
      })
      .error(function(){
        /* error handling */
      });
      return deferred.promise;
    },getParameterfilterByAncestor: function(val){
      var data = {
        param : val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/parameterfilterByAncestor', data)
      .success(function(response) {
        angular.forEach(response, function(card) {
          result.push(card);
        });
        return deferred.resolve(result);
      })
      .error(function(){
        /* error handling */
      });
      return deferred.promise;
    },'updateparameter': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      var parameter = new parametersService(param);
      parameter.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.parameter = null;
            self.tempParent = null;
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },
    'create': function(parameters){
      var defer = $q.defer();
      self.isSaving = true;
      var parameter = new parametersService(parameters);
      console.log(parameter);
      parameter.$save(function(data){
       self.tempAncestors = [];
       self.parameter = null;
       self.tempParent = null;
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadparameters();
            defer.resolve();
          }, function(err){
            console.log(err);
            defer.reject(err);
          });
      return defer.promise;

    },'resetForm': function(){
        self.parameters = {};
        self.parameter = null;
        self.selectedParam = null;
        self.saveMode = 'create';
    },'delete': function(parameter){
      var defer = $q.defer();
      self.isSaving = true;
      var parameterDelete = new parametersService({ _id : parameter._id});
      parameterDelete.$remove(function(data){
       self.parameter = null;
       self.tempParent = null;
            // self.isSaving = false;
            // self.hasMore = true;
            // self.isLoading = false;
            // self.page = 1;
            // self.count = 25;
            // self.loadparameters();
            defer.resolve();
          }, function(err){
            console.log(err);
            defer.reject(err);
          });
      return defer.promise;
    },
    'doOrder': function(order){
      self.hasMore = true;
      self.isLoading = false;
      self.page = 1;
      self.cars = [];
      self.ordering = order;
      self.count = 25;
      self.loadcars();
    },
    'doSearch': function(search){
      self.hasMore = true;
      self.isLoading = false;
      self.page = 1;
      self.cars = [];
      self.search = search;
      self.count = 25;
      self.loadcars();
    }
  };
  self.loadparameters();
  return self;

}]);
})();
