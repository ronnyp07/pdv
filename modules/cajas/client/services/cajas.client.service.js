//cajas service used to communicate cajas REST endpoints
(function () {
  'use strict';

  var cajasModule = angular.module('cajas');
  cajasModule.factory('CajasService', CajasService);

  CajasService.$inject = ['$resource'];

  function CajasService($resource) {
    return $resource('api/cajas/:CajaId', {
      CajaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET' }
    });
  }

  cajasModule.service('CajaRestServices',  ['$q', '$http', '$timeout', 'CajasService', 'Authentication', function($q, $http, $timeout, CajasService, Authentication){
    var self ={
     'cajas': [],
     'tempAncestors': [],
     'tempParent': null,
     'caja': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'count': 25,
     'counter': 5,
     'ordering': null,
     'search': '',
     'sucursalSearch': null,
     'isSaving': false,
     'isLoading': false,
     'cajasList': [],
     'loadcajas': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch},
        'ordering': self.ordering
      };

      CajasService.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.cajasList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.cajasList.push(item);
          });

          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
      return defer.promise;

    },'loadMore': function(page){
      self.count += self.counter;
      self.loadcajas();
    }, loadSucursal : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;

    },'update': function(param){
      var defer = $q.defer();
      self.isSaving = true;
      var Caja = new CajasService(param);
      Caja.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.caja = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
      return defer.promise;
    },
    'create': function(cajas){
      var defer = $q.defer();
      self.isSaving = true;
      var Caja = new CajasService(cajas);

      Caja.$save(function(data){
            defer.resolve();
          }, function(err){
            console.log(err);
            defer.reject(err);
          });
      return defer.promise;
    },
    'delete': function(Caja){
      var defer = $q.defer();
      self.isSaving = true;
      var CajaDelete = new CajasService({ _id : Caja._id});
      CajaDelete.$remove(function(data){
       self.caja = {};

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
      self.count = 25;
      self.loadcajas();
    },
    'doSearch': function(search){
      self.hasMore = true;
      self.isLoading = false;
      self.page = 1;
      self.count = 25;
      self.loadcajas();
    }
  };

  self.loadSucursal();
  self.loadcajas();
  return self;

}]);
})();
