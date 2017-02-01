//lotes service used to communicate lotes REST endpoints
(function () {
  'use strict';

  var LoteModel = angular.module('lotes');
  LoteModel.factory('lotesService', lotesService);
  lotesService.$inject = ['$resource'];
  function lotesService($resource) {
    return $resource('api/lotes/:LoteId', {
      LoteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  LoteModel.factory('LoteListServices', LoteListServices);
  LoteListServices.$inject = ['$resource'];
  function LoteListServices($resource) {
    return $resource('/api/LoteList',
     {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  LoteModel.service('LotesRestServices',  ['$q', '$http', '$timeout', 'lotesService', 'Authentication', '$rootScope', 'Security', '$state', 'LoteListServices', function($q, $http, $timeout, lotesService, Authentication, $rootScope, Security, $state, LoteListServices){
    var self ={
     'lotes': {},
     'tempAncestors': [],
     'lotesList' : [],
     'loteList': [],
     'loteRest': null,
     'listLotePromotion': [],
     'loteSelected': null,
     'tempSelectedLote': null,
     'sucursalSearch': null,
     'noLote': null,
     'productId': null,
     'product': {},
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'saveMode': '',
     'provider': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'counter': 5,
     'count': 25,
     'ordering': null,
     'startDate': new Date(moment().subtract(1, 'months').endOf('month').format('MM/DD/YYYY')),
     'endDate': new Date(),
     'isSaving': false,
     'lotestatus': null,
     'isLoading': false,
     'carList': [],
     //get Lote list by the company Id
     //end point lotes/routes
     'getLoteByCompany': function(company){
      var result = [];
      var defer = $q.defer();
      $http.get('/api/LoteList', {params: {companyId: company}}).success(function(response) {
        console.log(response);
        angular.forEach(response, function(card) {
          result.push(card);
        });
        return defer.resolve(result);
      })
      .error(function(){
        /* error handling */
      });
      return defer.promise;
     },
     'loadlotes': function(){
       var defer = $q.defer();
        self.isLoading = true;
         self.params = {
          'search': {
             sucursalId: self.sucursalSearch,
             noLote: self.noLote,
             productId: self.productId,
             isActive: true
           }
        };
        lotesService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.lotesList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.lotesList.push(item);
          });
          defer.resolve(self.lotesList);
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;
    },'loadMore': function(page){
        self.count += self.counter;
        self.loadlotes();
     },'getLoteFilter': function(param){
        var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          params: {
             sucursalId: param.sucursalId !== null ? param.sucursalId : '',
             noLote: param.noLote !== null ? param.noLote : '',
             productId: param.productId !== null ? param.productId : '',
           }
        };
       $http.get('/api/getfilterLote', self.params).success(function(data){
        defer.resolve(data);
        self.lotesList = [];
        if(data){
          angular.forEach(data, function(item){
            self.lotesList.push(item);
          });
          self.isLoading = false;
          defer.resolve(self.lotesList);
        }
      }, function(error){
        defer.reject();
      });
       return defer.promise;

    },'getMaxLote': function(val){
      var data = {
       LoteId: val
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
   },'update': function(param){
    var defer = $q.defer();
    self.isSaving = true;
    var Lote = new lotesService(param);
    Lote.$update(function(data){
      self.Lote = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },'create': function(Lote){
    var defer = $q.defer();
    self.isSaving = true;
    var Lote = new lotesService(Lote);
    Lote.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },'delete': function(Lote){
    var defer = $q.defer();
    self.isSaving = true;
    var LoteDelete = new lotesService({ _id : Lote._id});
    LoteDelete.$remove(function(data){
     self.Lote = {};
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },totalLoteProduct : function(items) {
      var itemSaved = 0;
      _.forEach(items, function (i) {
          // if(i.action){
            if(i.action === 'd'){
             itemSaved += 0;
            }else{
              itemSaved += Number(i.exFinal);
            }
          // }
          // itemSaved += Number(i.exFinal);
      });
      return itemSaved;
  },'doOrder': function(order){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.cars = [];
    self.ordering = order;
    self.count = 25;
    self.loadcars();
  },'doSearch': function(search){
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadlotes();
  },'setStatus': function(status){
     self.lotestatus = status;
     if(status !== 'PENDIENTE'){
      self.LoteCompleteOrder = true;
     }
     self.doSearch();
  },'createLotes': function(items){
    var defer = $q.defer();
       _.forEach(items, function (i) {
           if(i.action){
             if(i.action === 'n'){
              self.create(i);
             }else if (i.action === 'd' && i._id){
              self.delete(i);
             }else if (i.action === 'u'){
               if(i._id){
                 self.update(i);
               }else{
                 self.create(i);
               }
             }
           }
      });
      defer.resolve();

      return defer.promise;
  },updateItemQuantityByIndex: function(index, quantity){
     var defer = $q.defer();
     self.lotesList[index].exFinal = Number(quantity);
     // cart.items[index].total = Number(cart.items[index].quantity) *  Number(self.state === 'compra' ? cart.items[index].cost : cart.items[index].price);
     // defer.resolve(cart.items);
     // return defer.promise;
  },'currentStuck': function(data){
     self.product.loteRest = self.product.inStock - self.totalLoteProduct(data);
  },'authCheck': function(){
     Security.authCheck();
  },'watchFilters': function () {
      $rootScope.$watch(function () {
        return self.provider;
      }, function (newVal) {

        if (angular.isDefined(newVal)) {
           self.doSearch();
        }
      });

      $rootScope.$watch(function(){
        return self.endDate;
      }, function(newVal){
          if(angular.isDefined(newVal)){
             self.doSearch();
          }
      });

      $rootScope.$watch(function(){
         return self.startDate;
      }, function(newVal){
        if(angular.isDefined(newVal)){
          self.doSearch();
        }
      });
    }
};
//self.authCheck();
self.loadlotes();
return self;
}]);
})();
