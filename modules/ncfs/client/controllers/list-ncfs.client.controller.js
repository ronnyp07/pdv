(function () {
  'use strict';

  angular
  .module('ncfs')
  .controller('NcfsListController',  NcfsListController);

  NcfsListController.$inject = ['NcfsService', '$scope', '$modal', 'ParameterRestServices', 'Authentication', 'NcfsRestServices'];

  function NcfsListController(NcfsService, $scope, $modal, ParameterRestServices, Authentication, NcfsRestServices) {
    var vm = this;
    vm.imageURL = 'modules/users/img/profile/default.png';
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.paramRestServices = ParameterRestServices;
    vm.ncfServices = NcfsRestServices;
    vm.ncfs = NcfsService.query();
    vm.ncf = {};

    //Abre el pop up
    vm.showCreateNcfModal = function(){
      vm.createModal = $modal({
        scope: $scope,
        'templateUrl': 'modules/ncfs/partials/ncf-form.html',
        show: true
      });
    };

   //Cierra el pop up
   vm.cancelModal = function(){
    vm.createModal.hide();
    vm.ncf = {};
  };

  //Guarda los cambios de la NCF patalla
  vm.createNcf = function(){
     //TODO:Set the sucursalid when is login as super user
     vm.ncf.sucursalId = vm.authentication.sucursal.sucursalId._id;
     vm.ncf.code = vm.ncf.codes.code;
     vm.ncf.desc = vm.ncf.codes.desc;
     vm.ncf.secuencia = 0;
     var itemCheck = vm.ncfServices.checkNcf(vm.ncf.code);
     if(!angular.equals(itemCheck, {})){
       if(itemCheck.secuencia >= itemCheck.secFinal){

          //update the current item with the current secuencia
          itemCheck.isActive = false;
          vm.ncfServices.update(itemCheck).then(function(){
              vm.searchNcf();

          });
       }else{
            alertify.alert('Tipo de comprobante con secuencia activa').setHeader('<i class="fa fa-warning"></i> ');
       }
     }else{
        vm.saveItem(vm.ncf);
     }
   };

   //Actualiza la lista
   vm.searchNcf = function(item){
    var param = {
         sucursalId : vm.authentication.sucursal.sucursalId._id
       };
    vm.ncfServices.getNcfFilter(param).then(function(){
       alertify.success('Acción realizada exitosamente!!');
       vm.ncf = {};
       }) ;
   };

   //Crea el ncf
   vm.saveItem = function(item){
      vm.ncfServices.create(item).then(function(){
        vm.searchNcf();
        vm.createModal.hide();
     }, function(error){
      alertify.error('Ha ocurrido un error en el sistema');
    });
   };

   //actualiza el status isActive to false;
   vm.delete = function(item){
     item.isActive = false;
      vm.ncfServices.update(item).then(function(){
              vm.searchNcf();
      });
   };
 }
})();
