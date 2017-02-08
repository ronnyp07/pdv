//Logs service used to communicate Logs REST endpoints
(function () {
  'use strict';

  var logModel = angular.module('logs');
  logModel.factory('LogsService', LogsService);
  LogsService.$inject = ['$resource'];
  function LogsService($resource) {
    return $resource('api/logs/:logId', {
      logId: '@_id'
    }, {
       update: { method: 'PUT'},
       query: {method: 'GET', isArray: true }
    });
  }

logModel.service('LogsRestServices',  ['$q', '$http', '$timeout', 'LogsService', 'Authentication', '$rootScope', function($q, $http, $timeout, LogsService, Authentication, $rootScope){
    var self ={
     'logs': {},
     'tempAncestors': [],
     'logsList': [],
     'listLogPromotion': [],
     'tempSelectedLog': null,
     'importInfo': {},
     'search': {},
     'date': {},
     'params': {},
     'providerWindowOpen': false,
     'logCompleteOrder': false,
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
     'logStatus': null,
     'isLoading': false,
     'carList': [],
     'loadLogs': function(){
       var defer = $q.defer();
        self.isLoading = true;
        self.params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
                     startDate: moment(self.startDate).format('MM/DD/YYYY'),
                     endDate: moment(self.endDate).format('MM/DD/YYYY'),
                     provider: self.provider ? self.provider._id: null,
                     status: self.logStatus ? self.logStatus : null
                     },
                     // provider: self.provider ? self.provider._id: null
          'ordering': self.ordering
        };

        LogsService.get(self.params, function(data){
         self.total = data.total;
         defer.resolve(data);
         self.logsList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.logsList.push(item);
          });
          self.isLoading = false;
        }
      }, function(error){
        defer.reject();
      });
        return defer.promise;

    },'loadMore': function(page){
        self.count += self.counter;
        self.loadproducts();
     },'getLogByUser': function(val){
      var data = {
       userId: val
     };
     var deferred =  $q.defer();
     $http.post('/api/getLogsByUser', data)
     .success(function(response) {
      return deferred.resolve(response);
     })
     .error(function(){
      /* error handling */
    });
     return deferred.promise;
   },
   'update': function(param){
    var defer = $q.defer();
    self.isSaving = true;
    var Log = new LogsService(param);
    Log.$update(function(data){
      self.Log = {};
      defer.resolve(data);
    }, function(err){
      console.log(err);
      self.isSaving = false;
      defer.reject(err);
    });
    return defer.promise;
  },
  'create': function(log){
    var defer = $q.defer();
    self.isSaving = true;
    var Log = new LogsService(log);

    Log.$save(function(data){
     defer.resolve();
   }, function(err){
    console.log(err);
    defer.reject(err);
  });
    return defer.promise;
  },
  'delete': function(Log){
    var defer = $q.defer();
    self.isSaving = true;
    var LogDelete = new LogsService({ _id : Log._id});
    LogDelete.$remove(function(data){
     self.Log = {};
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
    self.count = 25;
    self.loadLogs();
  },'setStatus': function(status){
     self.logStatus = status;
     if(status !== 'PENDIENTE'){
      self.logCompleteOrder = true;
     }
     self.doSearch();
  },checkPosSession: function(param){
    var defer = $q.defer();
    $http.post('/api/getMulFilter', {user: param})
          .success(function(result){
           if(result){
            defer.resolve(result);
           }
     });

     return defer.promise;
  }
};

self.loadLogs();

return self;
}]);
})();
