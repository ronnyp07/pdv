//sessions service used to communicate sessions REST endpoints
(function () {
  'use strict';

  var sessionsModule = angular.module('sessions');
  sessionsModule.factory('SessionsService', SessionsService);

  SessionsService.$inject = ['$resource'];

  function SessionsService($resource) {
    return $resource('api/sessions/:SessionId', {
      SessionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET' }
    });
  }

  sessionsModule.service('SessionRestServices',  ['$q', '$http', '$timeout', 'SessionsService', 'Authentication', function($q, $http, $timeout, SessionsService, Authentication){
    var self ={
     'sessions': [],
     'session': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,/**/
     'count': 25,
     'counter': 5,
     'ordering': null,
     'selectedCaja': null,
     'sessionInfo': null,
     'search': '',
     'sucursalSearch': null,
     'isSaving': false,
     'isLoading': false,
     'efectivo' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'tarjeta' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'cheque' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'vales' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'transferencia' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'totales' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, ac:0, com:0, dev:0, ap:0, nc:0, sa:0, en:0, entradas: 0, salidas: 0 },
     'salesInfo' : { ventasNetas: 0, itbs: 0, brutos: 0, ventasCredito : 0, totalTran: 0, ventasEfectivo: 0, entradas: 0, salidas: 0 },
     'sessionsList': [],
     'loadsessions': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch},
        'ordering': self.ordering
      };

      SessionsService.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.sessionsList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.sessionsList.push(item);
          });

          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
      return defer.promise;

    },'loadMore': function(page){
      self.count += self.counter;
      self.loadsessions();
    }, loadSucursal : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;

    },'cierreCalculateTotal': function(index, input){
      var defer = $q.defer();
      self.cuadreList[index].cantidad = input.cantidad;
      self.cuadreList[index].total = Number(input.cantidad) * input.moneda;
      defer.resolve(self.cuadreList);
      return defer.promise;
    },'getTotal': function(items){
      var subtotal = 0;
      if (items) {
        _.forEach(items, function (item) {
          subtotal = subtotal + item.total;
        });
      }
      return subtotal;
    }, 'updateSession': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      var Session = new SessionsService(param);
      Session.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.session = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },
    'create': function(sessions){
      var defer = $q.defer();
      self.isSaving = true;
      var Session = new SessionsService(sessions);

      Session.$save(function(data){
        defer.resolve(data);
      }, function(err){
        console.log(err);
        defer.reject(err);
      });
      return defer.promise;
    },
    'delete': function(Session){
      var defer = $q.defer();
      self.isSaving = true;
      var SessionDelete = new SessionsService({ _id : Session._id});
      SessionDelete.$remove(function(data){
       self.session = {};
       defer.resolve();
     }, function(err){
      console.log(err);
      defer.reject(err);
    });
      return defer.promise;
    },'uploadSessionInfo': function(){
     self.sessionInfo =  Authentication.session.get('session');
     return  self.sessionInfo;
   },
   'doOrder': function(order){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadsessions();
  },'doSearch': function(search){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadsessions();
  }, calculateType: function(type){
    var defer = $q.defer();
    var total = 0
    if(type === 'efectivo'){
      self.efectivo.diferencia = Number(self.efectivo.contado) - Number(self.efectivo.calculado);
      self.efectivo.retirado = self.efectivo.contado;
    }else if (type === 'tarjeta'){
      self.tdiferencia = self.tarjeta.calculado - self.tarjeta.contado;
      self.tarjeta.retirado = self.tarjeta.contado;
    }else if(type === 'cheque'){
       self.cheque.diferencia = Number(self.cheque.contado) - Number(self.cheque.calculado)
      self.cheque.retirado = self.cheque.contado;
    }else if(type === 'vales'){
      self.vales.diferencia = Number(self.vales.contado) - Number(self.vales.calculado)
      self.vales.retirado = self.vales.contado;
    }else if(type === 'transferencia'){
      self.transferencia.diferencia = Number(self.transferencia.contado) - Number(self.transferencia.calculado)
      self.transferencia.retirado = self.transferencia.contado;
    }else if(type === 'retirado'){
      self.totales.retirado = self.efectivo.retirado + self.tarjeta.retirado + self.cheque.retirado + self.vales.retirado + self.transferencia.retirado;
    }
    defer.resolve();
    return defer.promise;
  },
  'cuadreList': [
  {moneda: 1, cantidad:0, total:0},
  {moneda: 5, cantidad:0, total:0},
  {moneda: 10, cantidad:0, total:0},
  {moneda: 20, cantidad:0, total:0},
  {moneda: 25, cantidad:0, total:0},
  {moneda: 50, cantidad:0, total:0},
  {moneda: 100, cantidad:0, total:0},
  {moneda: 200, cantidad:0, total:0},
  {moneda: 500, cantidad:0, total:0},
  {moneda: 1000, cantidad:0, total:0},
  {moneda: 2000, cantidad:0, total:0}]
};

self.loadSucursal();
self.loadsessions();
self.uploadSessionInfo();
return self;

}]);
})();
