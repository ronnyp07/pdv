
  'use strict';

  var parameterModule = angular.module('parameters')
    .controller('ParametersListController', ['parametersService', '$scope', 'ParameterRestServices', '$http', '$q', 'NgTableParams', '$modal', 'Authentication', 'SucursalsRestServices',  function ParametersListController(parametersService, $scope, ParameterRestServices, $http, $q, NgTableParams, $modal, Authentication, SucursalsRestServices) {
    var vm = this;
    vm.parameters = parametersService.query();
    vm.paramRestServices = ParameterRestServices;
    vm.authentication = Authentication;
    vm.sucursalServices = SucursalsRestServices;
    vm.parameter = {};

    var params = {
          page: 1,
          count: 50,
          test: 'test'
       };

    var settings = {
         filterDelay: 300,
         total: 0,
         getData: function(params) {
          return parametersService.get(params.url()).$promise.then(function(data) {
          $scope.total = data.total;
          params.total(data.total);
          return vm.paramRestServices.joinAll(data.results);
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
             show: true,
             backdrop: 'static'
             // placement: 'center'
        });
    };

        /* jshint ignore:start */
    $scope.tableParams = new NgTableParams({page: 1, count: 50, companyId: vm.authentication.user.companyId}, settings);

    vm.createParameter = function(parameter){
      if(vm.paramRestServices.saveMode === 'create'){

      if(vm.paramRestServices.selectedParam){
         var ancestors = [];
    	     // if(vm.paramRestServices.selectedParam.ancestors.length > 0){
    	     // 	angular.forEach(vm.paramRestServices.selectedParam.ancestors, function(card) {
          //             vm.paramRestServices.tempAncestors.push(card);
          //         });
    	     // }
           ancestors = vm.paramRestServices.joinAncestors(vm.paramRestServices.selectedParam);
    	     ancestors.push(vm.paramRestServices.selectedParam._id);
           //vm.paramRestServices.tempAncestors.push(vm.paramRestServices.selectedParam._id);
    	     vm.paramRestServices.parameter.ancestors = ancestors;
    	     vm.paramRestServices.parameter.parent = vm.paramRestServices.selectedParam._id;
    	     vm.paramRestServices.parameter.companyId = vm.authentication.user.companyId;
      }
     //console.log(vm.paramRestServices.parameter);
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
              companyId: val
          };
          var result = [];
          var deferred =  $q.defer();

          $http.post('/api/parameterfilter', data)
              .success(function(response) {
                  angular.forEach(response, function(card) {
                      result.push(card);
                  });
                  return deferred.resolve(vm.paramRestServices.joinAll(result));
              })
              .error(function(){
                  /* error handling */
              });
          return deferred.promise;
  };
}]);

