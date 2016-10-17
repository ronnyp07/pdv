
  'use strict';

  var parameterModule = angular.module('parameters')
    .controller('ParametersListController', ['parametersService', '$scope', 'ParameterRestServices', '$http', '$q', 'NgTableParams', '$modal',  function ParametersListController(parametersService, $scope, ParameterRestServices, $http, $q, NgTableParams, $modal ) {
    var vm = this;
    vm.parameters = parametersService.query();
    vm.paramRestServices = ParameterRestServices;
    vm.parameter = {};

    var params = {
          page: 1,
          count: 50
       };

    var settings = {
         filterDelay: 300,
         total: 0,
         getData: function(params) {
          return parametersService.get(params.url()).$promise.then(function(data) {
          $scope.total = data.total;
          params.total(data.total);
          return data.results;
        });
       }
       };
       vm.cancel = function(){
         vm.createModal.hide();
         vm.paramRestServices.resetForm();

       };

        vm.showCreateParameterModal = function(saveParam){
        if(!saveParam){
           vm.paramRestServices.resetForm();
        }else{
           vm.paramRestServices.saveMode = 'update';
           vm.paramRestServices.parameter = saveParam;
           vm.paramRestServices.selectedParam = saveParam.parent ? saveParam.parent: null;
        }

        vm.createModal = $modal({
             scope: $scope,
             'templateUrl': 'modules/parameters/partials/template.savemodel.tpl.html',
             show: true
             // placement: 'center'
        });
    };

        /* jshint ignore:start */
    $scope.tableParams = new NgTableParams({}, settings);

    $scope.createParameter = function(parameter){
      if(vm.paramRestServices.saveMode === 'create'){
    	if(vm.paramRestServices.selectedParam){
    	     if(vm.paramRestServices.selectedParam.ancestors.length > 0){
    	     	angular.forEach(vm.paramRestServices.selectedParam.ancestors, function(card) {
                      vm.paramRestServices.tempAncestors.push(card);
                  });
    	     }
    	     vm.paramRestServices.tempAncestors.push(vm.paramRestServices.selectedParam._id);
    	     vm.paramRestServices.parameter.ancestors = vm.paramRestServices.tempAncestors;
    	     vm.paramRestServices.parameter.parent = vm.paramRestServices.selectedParam._id;
    	}
 		  vm.paramRestServices.create(vm.paramRestServices.parameter).then(function(){
      vm.createModal.hide();
      vm.reloadList();
      alertify.success('Acción realizada exitosamente!!');
 		   }, function(err){
      alertify.error(err.data.message);
 		  });
      }
     if(vm.paramRestServices.saveMode === 'update'){
            vm.paramRestServices.parameter.parent = vm.paramRestServices.selectedParam ? vm.paramRestServices.selectedParam._id : '';
            vm.paramRestServices.updateparameter(vm.paramRestServices.parameter).then(function(){
            vm.createModal.hide();
            vm.reloadList();
            alertify.success('Acción realizada exitosamente!!');
            vm.paramRestServices.saveMode = '';
        });
        }
   };

   vm.delete = function(parameter){
    if(parameter.systemParam){
        alertify.error('No puede eliminar un parametro del sistema!!');

     }else{
        vm.paramRestServices.delete(parameter).then(function(){
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
  };
}]);

