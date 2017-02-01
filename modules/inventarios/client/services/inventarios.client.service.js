//Inventarios service used to communicate Inventarios REST endpoints
(function () {
  'use strict';

  var inventoryModel = angular.module('inventarios');
  inventoryModel.factory('InventariosService', InventariosService);

  InventariosService.$inject = ['$resource'];

  function InventariosService($resource) {
    return $resource('api/inventarios/:inventarioId', {
      inventarioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }



  inventoryModel.service('InventoryRestServices',  ['$q', '$http', '$timeout', 'InventariosService', function($q, $http, $timeout, InventariosService){
    var self ={
     'inventory': [],
     'tempAncestors': [],
     'listInventoryPromotion': [],
     'tempSelectedInventory': null,
     'importInfo': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'count': 25,
     'ordering': null,
     'search': '',
     'isSaving': false,
     'isLoading': false,
     'carList': [],
     'getInventoryFilter': function(val){
      var data = {
        bardCode: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/InventoryFilter', data)
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
    },'getMaxInventory': function(val){
      var data = {
         sucursalId: val
      };
      var result = [];
      var deferred =  $q.defer();

      $http.post('/api/getMaxInventario', data)
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
    },updateFields: function(cartArray, inventoryArray){
      var defer  = $q.defer();
      var inventoryOutPut  = new InventariosService(inventoryArray);
      _.forEach(cartArray, function(value, key)
        {_.forEach(inventoryArray.listinventoryPromotion, function(value2, key)
          { if(value.productId === value2.productId){
            inventoryOutPut.listinventoryPromotion[key].entrada += value.quantity;
            inventoryOutPut.listinventoryPromotion[key].saldo = (inventoryOutPut.listinventoryPromotion[key].saldoIni + inventoryOutPut.listinventoryPromotion[key].entrada) - value2.salida;
          }
        });
      });

      inventoryOutPut.$update(function(data){
         defer.resolve(data);
      }, function(err){
         defer.refect(err);
       console.log(err);
      });

      return defer.promise;
    },invOutPutField: function(cartArray, inventoryArray){
      var defer  = $q.defer();
      var inventoryOutPut  = new InventariosService(inventoryArray);
      _.forEach(cartArray, function(value, key)
        {_.forEach(inventoryArray.listinventoryPromotion, function(value2, key)
          { if(value.productId === value2.productId){
            inventoryOutPut.listinventoryPromotion[key].salida += value.quantity;
            inventoryOutPut.listinventoryPromotion[key].saldo = (inventoryOutPut.listinventoryPromotion[key].saldoIni + inventoryOutPut.listinventoryPromotion[key].entrada) - value2.salida;
          }
        });
      });

      inventoryOutPut.$update(function(data){
         defer.resolve(data);
      }, function(err){
         defer.refect(err);
       console.log(err);
      });

      return defer.promise;
    },'update': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      var Inventory = new InventariosService(param);
      Inventory.$update(function(data){
            self.Inventory = {};
            defer.resolve(data);
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },
    'create': function(inventory){
      var defer = $q.defer();
      self.isSaving = true;
      var Inventory = new InventariosService(inventory);

      Inventory.$save(function(data){
       self.tempAncestors = [];
       self.Inventory = {};
       defer.resolve();
     }, function(err){
      console.log(err);
      defer.reject(err);
    });
      return defer.promise;

    },
    'delete': function(Inventory){
      var defer = $q.defer();
      self.isSaving = true;
      var InventoryDelete = new InventariosService({ _id : Inventory._id});
      InventoryDelete.$remove(function(data){
       self.Inventory = {};
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
  return self;
}]);

})();
