'use strict';

var providerModule = angular.module('parameters')
.controller('ProvidersListController', ['providersService', '$scope', 'ProviderRestServices', '$http', '$q', 'NgTableParams', '$modal',  function ProvidersListController(providersService, $scope, ProviderRestServices, $http, $q, NgTableParams, $modal ) {

  var vm = this;
  vm.provider = providersService.query();
  vm.paramRestServices = ProviderRestServices;
  vm.paramRestServices.provider.isActive = true;
  vm.provider = {};

  var params = {
    page: 1,
    count: 3
  };

  var settings = {
   filterDelay: 300,
   total: 0,
   getData: function(params) {
    return providersService.get(params.url()).$promise.then(function(data) {
      $scope.total = data.total;
      params.total(data.total);
      return data.results;
    });
  }
};

vm.showCreateProviderModal = function(saveParam){
  if(!saveParam){
   vm.paramRestServices.providers = {};
   vm.paramRestServices.saveMode = 'create';
 }else{
   vm.paramRestServices.saveMode = 'update';
   vm.paramRestServices.provider = saveParam;
 }

 vm.createModal = $modal({
   scope: $scope,
   'templateUrl': 'modules/providers/partials/template.savemodel.tpl.html',
   show: true
             // placement: 'center'
           });
};

/* jshint ignore:start */
$scope.tableParams = new NgTableParams({}, settings);

$scope.test = function(){
 console.log('test');
};

$scope.createProvider = function(provider, valid){

if(valid){
  if(vm.paramRestServices.saveMode === 'create'){
  vm.paramRestServices.create(vm.paramRestServices.provider).then(function(){
    vm.createModal.hide();
    vm.reloadList();
    alertify.success('Acción realizada exitosamente!!');
  }, function(){
    alertify.error('Ha ocurrido un error en el sistema!!');
  });
}
if(vm.paramRestServices.saveMode === 'update'){
  vm.paramRestServices.updateProvider(vm.paramRestServices.provider).then(function(){
    vm.createModal.hide();
    vm.reloadList();
    alertify.success('Acción realizada exitosamente!!');
    vm.paramRestServices.saveMode = '';
  });
}
}else{
    alertify.error('Informacion incompleta!!');
}

};

vm.delete = function(provider){
  if(provider.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');

  }else{
    vm.paramRestServices.delete(provider).then(function(){
      vm.reloadList();
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};

vm.reloadList = function(){
 $scope.tableParams.reload();
};

$scope.getParamsFilter = function(val){
  var data = {
    id: val
  };
  var result = [];
  var deferred =  $q.defer();

  $http.post('/api/providerfilter', data)
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
};
}]);

