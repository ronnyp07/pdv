(function () {
  'use strict';

  // Sucursals controller
  angular
  .module('sucursals')
  .controller('SucursalsUpdateController', SucursalsUpdateController);

  SucursalsUpdateController.$inject = ['$scope',  'Authentication',  'FileUploader', '$window', 'SucursalsService', 'SucursalsRestServices', '$state', '$timeout', '$stateParams', 'Notify'];

  function SucursalsUpdateController ($scope,  Authentication, FileUploader, $window, SucursalsService, SucursalsRestServices, $state, $timeout, $stateParams, Notify) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.sucursalServices = SucursalsRestServices;
    vm.sucursalServices.sucursal = SucursalsService.get({sucursalId: $stateParams.sucursalId}, function(data){
    vm.imageURL = data.picturesURL ? data.picturesURL : 'modules/core/img/no-imagen.jpg';
    });

  // Create file uploader instance
  vm.uploader = new FileUploader({
    url: '/api/sucursals'
  });

  // Set file uploader image filter
  vm.uploader.filters.push({
    name: 'imageFilter',
    fn: function (item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

 vm.uploader.onBeforeUploadItem = function (item) {
   vm.sucursalServices.sucursal.modeOn = 'update';
   item.formData.push(vm.sucursalServices.sucursal);
 };

 // Cancel the upload process
 vm.cancel = function(){
  vm.uploader.cancelAll();
  vm.uploader.clearQueue();
  vm.imageURL = 'modules/core/img/no-imagen.jpg';
 };

 vm.cancelForm = function(){
  $state.go('sucursals.list');
};

 // Called after the user selected a new picture file
 vm.uploader.onAfterAddingFile = function (fileItem) {
  if ($window.FileReader) {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileItem._file);
    fileReader.onload = function (fileReaderEvent) {
      $timeout(function () {
        vm.imageURL = fileReaderEvent.target.result;
      }, 0);
    };
  }
};

vm.saveSucursal = function(sucursal, isValid){
  console.log('called');
    if ( isValid){
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
        alertify.success('Acción realizada exitosamente!!');
        Notify.sendMsg('refreshSucursal', {nothing: ''});
        $state.go('sucursals.list');
      }else{
         vm.sucursalServices.update(sucursal).then(function(){
          Notify.sendMsg('refreshSucursal', {nothing: ''});
         $state.go('sucursals.list');
         alertify.success('Acción realizada exitosamente!!');
       }, function(err){
         alertify.error(err.data.message);
       });
      }
    }else{
      alertify.error('Completar los campos requeridos');
    }
};
}
})();
