//Ncfs service used to communicate Ncfs REST endpoints
(function () {
  'use strict';

   var NcfModel = angular.module('ncfs');

  NcfModel.factory('NcfsService', NcfsService);

  NcfsService.$inject = ['$resource'];

  function NcfsService($resource) {
    return $resource('api/ncfs/:ncfId', {
      ncfId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

 NcfModel.service('NcfsRestServices',  ['$q', '$http', '$timeout', 'NcfsService', 'Authentication', '$rootScope', 'Security', '$state',  function($q, $http, $timeout, NcfsService, Authentication, $rootScope, Security, $state){
    var self ={
     'ncfs': {},
     'tempAncestors': [],
     'ncfsList' : [],
     'ncfSelected': null,
     'sucursalSearch': null,
     'noNcf': null,
     'search': {},
     'params': {},
     'saveMode': '',
     'hasMore': true,
     'page': 1,
     'total': 0,
     'counter': 5,
     'count': 25,
     'ordering': null,
     'startDate': new Date(moment().subtract(1, 'months').endOf('month').format('MM/DD/YYYY')),
     'endDate': new Date(),
     'isSaving': false,
     'ncfstatus': null,
     'isLoading': false,
     'loadncf': function(){
       var defer = $q.defer();
        self.isLoading = true;
         self.params = {
          'search': {
             sucursalId: self.sucursalSearch,
             noNcf: self.noNcf,
             isActive: true
           }
        };
        NcfsService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.ncfsList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.ncfsList.push(item);
          });
          defer.resolve(self.ncfsList);
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;
    },'loadMore': function(page){
        self.count += self.counter;
        self.loadncfs();
     },'getNcfFilter': function(param){
        var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          params: {
             sucursalId: param.sucursalId !== null ? param.sucursalId : '',
             noNcf: param.noNcf !== null ? param.noNcf : ''
           }
        };
       $http.get('/api/getfilterNcf', self.params).success(function(data){
        defer.resolve(data);
        self.ncfsList = [];
        if(data){
          angular.forEach(data, function(item){
            self.ncfsList.push(item);
          });
          self.isLoading = false;
          defer.resolve(self.ncfsList);
        }
      }, function(error){
        defer.reject();
      });
       return defer.promise;
    },'checkNcf': function(code){
       var exits = {};
       angular.forEach(self.ncfsList, function(item){
          if(item.code === code){
             exits = item;
          }
       });
       return exits;
    },'update': function(param){
        var defer = $q.defer();
        self.isSaving = true;
        var Ncf = new NcfsService(param);
        Ncf.$update(function(data){
          self.Ncf = {};
          defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },'create': function(param){
    var defer = $q.defer();
    self.isSaving = true;
    var ncf = new NcfsService(param);
    ncf.$save(function(data){
     defer.resolve(data);
   }, function(err){
    console.log(err);
    defer.reject(err);
   });
   return defer.promise;
  },'delete': function(Ncf){
    var defer = $q.defer();
    self.isSaving = true;
    var NcfDelete = new NcfsService({ _id : Ncf._id});
    NcfDelete.$remove(function(data){
     self.Ncf = {};
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
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
    self.loadncfs();
  },'authCheck': function(){
     Security.authCheck();
  }
};
//self.authCheck();
self.loadncf();
return self;
}]);

})();
