//cajaturnos service used to communicate cajaturnos REST endpoints
(function () {
  'use strict';

  var cajaturnosModule = angular.module('cajaturno');
  cajaturnosModule.factory('CajaturnosService', CajaturnosService);

  CajaturnosService.$inject = ['$resource'];

  function CajaturnosService($resource) {
    return $resource('api/cajaturnos/:CajaturnoId', {
      CajaturnoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET' }
    });
  }

  cajaturnosModule.service('CajaturnoRestServices',  ['$q', '$http', '$timeout', 'CajaturnosService', 'Authentication', 'MovimientoRestServices','SalesRestServices', function($q, $http, $timeout, CajaturnosService, Authentication, MovimientoRestServices, SalesRestServices){
    var self ={
     'cajaturnos': [],
     'cajaturno': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,/**/
     'count': 25,
     'counter': 5,
     'ordering': null,
     'selectedCaja': null,
     'cajaturnoInfo': null,
     'search': '',
     'movServices' : MovimientoRestServices,
     'salesServicecs': SalesRestServices,
     'sucursalSearch': null,
     'isSaving': false,
     'isValid': true,
     'isLoading': false,
     'efectivo' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, entradas: 0, salidas: 0, mantener: 0 },
     'tarjeta' : { contado: 0, calculado: 0, diferencia: 0, retirado:0 , entradas: 0, salidas: 0, mantener: 0 },
     'cheque' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, entradas: 0, salidas: 0, mantener: 0 },
     'vales' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, entradas: 0, salidas: 0, mantener: 0 },
     'transferencia' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, en:0, entradas: 0, salidas: 0, mantener: 0 },
     'totales' : { contado: 0, calculado: 0, diferencia: 0, retirado:0, entradas: 0, salidas: 0, mantener: 0 },
     'salesInfo' : { ventasNetas: 0, itbs: 0, brutos: 0, ventasCredito : 0, totalTran: 0, ventasEfectivo: 0, entradas: 0, salidas: 0, mantener: 0 },
     'cajaturnosList': [],
     'loadcajaturnos': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch},
        'ordering': self.ordering
      };

      CajaturnosService.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.cajaturnosList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.cajaturnosList.push(item);
          });

          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
      return defer.promise;

    },'loadMore': function(page){
      self.count += self.counter;
      self.loadcajaturnos();
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
    }, 'updateCajaturno': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      console.log(param);
      var cajaturno = new CajaturnosService(param);
      cajaturno.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.cajaturno = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },'getCuadre': function(cajaturnoId){
      self.movServices = MovimientoRestServices;
      self.salesServicecs.getSales({cajaturno: cajaturnoId}).then(function(sales){
        self.salesPendingInfo = _.chain(sales)
        .filter(isPending)
        .map(function(item){
          return {
            _id: item._id,
            salesId : item.salesId,
            fecha_venta: item.fecha_venta,
            total: item.total,
            customer: item.customer
          };
        })
        .value();

        function isPending(sales){
          if (sales.status === 'ESPERA'){
            return sales;
          }
        }

        _.forEach(sales, function (i) {
          getEfectivo(i);
        });

        function getEfectivo(sales){
          if(sales.status !== 'ESPERA'){
            self.salesInfo.ventasNetas += sales.subtotal;
            self.salesInfo.itbs += sales.itbs;
            if(sales.efectivo !== 0){
              self.efectivo.calculado += sales.total;
            }else if(sales.tarjeta !== 0){
              self.tarjeta.calculado += sales.total;
            }else if(sales.cheque !== 0){
              self.cheque.calculado += sales.total;
            }else if(sales.vales !== 0){
              self.vales.calculado += sales.total;
            }else if(sales.transferencia !== 0){
              self.transferencia.calculado += sales.total;
            }else if(sales.formaPago === 'credito') {
              self.salesInfo.ventasCredito += sales.credito;
            }
          }
        }

        self.salesInfo.brutos += self.salesInfo.ventasNetas + self.salesInfo.itbs;
        self.salesInfo.salidas += self.salesInfo.ventasNetas + self.salesInfo.itbs;
        self.salesInfo.totalTran = self.salesInfo.ventasCredito + self.salesInfo.brutos;
        self.salesInfo.totalFondo = self.cajaturnoInfo.cuadreOpen.efectivo + self.cajaturnoInfo.cuadreOpen.tarjeta + self.cajaturnoInfo.cuadreOpen.cheque + self.cajaturnoInfo.cuadreOpen.vales + self.cajaturnoInfo.cuadreOpen.transferencia;
        self.salesInfo.ventasEfectivo = getEfectivoTotal();

        self.movServices.getMovList({cajaturno: cajaturnoId, status: true}).then(function(mov){
          _.each(mov, function(item){
            if(item.tipoPago === 'EFECTIVO'){
              self.efectivo.entradas += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
              self.efectivo.salidas += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
            }else if(item.tipoPago === 'TARJETA'){
              self.tarjeta.entradas += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
              self.tarjeta.salidas += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
            }else if(item.tipoPago === 'CHEQUE'){
              self.cheque.entradas += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
              self.cheque.salidas += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
            }else if(item.tipoPago === 'VALES'){
              self.vales.entradas += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
              self.vales.salidas += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
            }else if(item.tipoPago === 'TRAN'){
              self.transferencia.entradas += item.tipoMovimiento === 'EN' ?  item.montoTotal : 0;
              self.transferencia.salidas += item.tipoMovimiento === 'SA' ?  item.montoTotal : 0;
            }
          });

          function calculateMov(mov){
           self.efectivo.calculado += self.efectivo.entradas <= self.efectivo.salidas ? 0 : self.efectivo.entradas - self.efectivo.salidas;
           self.efectivo.diferencia +=  self.efectivo.calculado;
           self.tarjeta.calculado += self.tarjeta.entradas <= self.tarjeta.salidas ? 0 : self.tarjeta.entradas - self.tarjeta.salidas;
           self.tarjeta.diferencia +=  self.tarjeta.calculado;
           self.cheque.calculado += self.cheque.entradas <= self.cheque.salidas ? 0 : self.cheque.entradas - self.cheque.salidas;
           self.cheque.diferencia +=  self.cheque.calculado;
           self.vales.calculado += self.vales.entradas <= self.vales.salidas ? 0 : self.vales.entradas - self.vales.salidas;
           self.vales.diferencia +=  self.vales.calculado;
           self.transferencia.calculado += self.transferencia.entradas <= self.transferencia.salidas ? 0 : self.transferencia.entradas - self.transferencia.salidas;
           self.transferencia.diferencia +=  self.transferencia.calculado;
         };

         calculateMov();
         self.totales.calculado = self.efectivo.calculado + self.tarjeta.calculado + self.cheque.calculado + self.vales.calculado + self.transferencia.calculado;
         self.totales.entradas = self.efectivo.entradas + self.tarjeta.entradas + self.cheque.entradas + self.vales.entradas + self.transferencia.entradas;
         self.totales.salidas = self.efectivo.salidas + self.tarjeta.salidas + self.cheque.salidas + self.vales.salidas + self.transferencia.salidas;
         self.totales.diferencia = self.totales.calculado;

       });
        self.efectivo.calculado += self.cajaturnoInfo.cuadreOpen.efectivo;
        self.tarjeta.calculado += self.cajaturnoInfo.cuadreOpen.tarjeta;
        self.cheque.calculado += self.cajaturnoInfo.cuadreOpen.cheque;
        self.vales.calculado += self.cajaturnoInfo.cuadreOpen.vales;
        self.transferencia.calculado += self.cajaturnoInfo.cuadreOpen.transferencia;

        function getEfectivoTotal(){
          return self.efectivo.calculado + self.tarjeta.calculado + self.cheque.calculado + self.vales.calculado + self.transferencia.calculado;
        }
      });



},'create': function(cajaturnos){
  var defer = $q.defer();
  self.isSaving = true;
  var Cajaturno = new CajaturnosService(cajaturnos);

  Cajaturno.$save(function(data){
    defer.resolve(data);
  }, function(err){
    console.log(err);
    defer.reject(err);
  });
  return defer.promise;
},
'delete': function(Cajaturno){
  var defer = $q.defer();
  self.isSaving = true;
  var CajaturnoDelete = new CajaturnosService({ _id : Cajaturno._id});
  CajaturnoDelete.$remove(function(data){
   self.cajaturno = {};
   defer.resolve();
 }, function(err){
  console.log(err);
  defer.reject(err);
});
  return defer.promise;
},'uploadCajaturnoInfo': function(){
 self.cajaturnoInfo =  Authentication.cajaturno.get('cajaturno');
 return  self.cajaturnoInfo;
},
'doOrder': function(order){
  self.hasMore = true;
  self.isLoading = false;
  self.page = 1;
  self.count = 25;
  self.loadcajaturnos();
},'doSearch': function(search){
  self.hasMore = true;
  self.isLoading = false;
  self.page = 1;
  self.count = 25;
  self.loadcajaturnos();
}, calculateType: function(type){
  var defer = $q.defer();
  var total = 0
  if(type === 'efectivo'){
    self.efectivo.diferencia = Number(self.efectivo.contado) - Number(self.efectivo.calculado);
    self.efectivo.retirado = self.efectivo.contado;
  }else if (type === 'tarjeta'){
    self.tarjeta.diferencia = Number(self.tarjeta.contado) - Number(self.tarjeta.calculado);
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
self.loadcajaturnos();
self.uploadCajaturnoInfo();
return self;

}]);
})();
