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
         tipo_sales_pago: 'Ventas Tipo Pago',
         tipo_unidades: 'Tipo Unidades'
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
     },ncfList:[
     {code: '01', desc : 'Comprobante con Valor Fiscal'},
     {code:'02', desc: 'Factura a Consumidor Final'},
     {code:'03', desc: 'Notas de Débitos'},
     {code:'04', desc:'Notas de Creditos'},
     {code:'14', desc:'Comprobante para Régimen Especial'},
     {code:'15', desc:'Comprobante Fiscal Gubernamental'},
     {code:'11', desc: 'Comprobante para Proveedores Informales'},
     {code:'13', desc: 'Comprobantes para Gastos Menores'},
     {code:'12', desc: 'Comprobantes de Registro Único de Ingresos'}
      ],
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
      var defer = $q.defer();
      parametersService.get({parameterId: param}, function(data){
          self.category = data;
           self.getParamsFilterByParent(null, data._id).then(function(result){
             self.children = result;
             defer.resolve(self.children);
           });
      });
      return defer.promise;
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
    },getParamByAncestors: function(){
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/getParamByAncestors')
      .success(function(response) {
        angular.forEach(response, function(card) {
          result.push(card);
        });

        return deferred.resolve(self.join(result));
      })
      .error(function(){
        /* error handling */
      });
      return deferred.promise;
    },joinParam: function(param){
       if(param.ancestors.length){
          return _.join(param.ancestors, '/') + '/' + param._id;
        }
    },'join': function(array){
     var result = [];
       _.forEach(array, function(o){
         if(o._id !== 'Categoria'){
            o.desc = _.replace(self.joinParam(o), 'Categoria/', '');
            result.push(o);
          }
         });
     return _.orderBy(result, ['desc'], ['asc']);
   },joinParamAll: function(param){
       if(param.ancestors.length){
          return _.join(param.ancestors, '/') + '/' + param._id;
        }else{
          return param._id;
        }
    },'joinAll': function(array){
     var result = [];
       _.forEach(array, function(o){
        // if(o._id !== 'Categoria'){
            o.desc = self.joinParamAll(o);
            result.push(o);
          //}
         });
     return _.orderBy(result, ['desc'], ['asc']);
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
            self.parameter = null;
            self.tempParent = null;
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },'joinAncestors' : function(param){
     var result = [];
     if(param.ancestors.length > 0){
         angular.forEach(param.ancestors, function(ancestor) {
                      result.push(ancestor);
           });
     }
     return result;


    },'create' : function(parameters){
      var defer = $q.defer();
      self.isSaving = true;
      var parameter = new parametersService(parameters);
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
            defer.resolve(data);
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
