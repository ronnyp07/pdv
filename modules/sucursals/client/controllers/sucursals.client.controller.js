(function () {
  'use strict';

  // Sucursals controller
  angular
  .module('sucursals')
  .controller('SucursalsController', SucursalsController);

  SucursalsController.$inject = ['$scope',  'Authentication',  'FileUploader', '$window', 'SucursalsRestServices', '$state', '$timeout'];

  function SucursalsController ($scope,  Authentication, FileUploader, $window, SucursalsRestServices, $state, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.imageURL = 'modules/core/img/no-imagen.jpg';
    vm.sucursalServices = SucursalsRestServices;
    vm.sucursalServices.sucursal = {};
    vm.sucursalServices.sucursal.isActive = true;

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
   item.formData.push(vm.sucursalServices.sucursal);
 };

 // Cancel the upload process
 vm.cancel = function(){
  vm.uploader.cancelAll();
  vm.uploader.clearQueue();
  vm.imageURL = 'modules/core/img/no-imagen.jpg';
 };

 vm.cancelForm = function(){
    vm.cancel();
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

vm.saveSucursal = function(Sucursal, isValid){
    if ( isValid){
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
         $state.go('sucursals.list');
      }else{
        vm.sucursalServices.create(Sucursal).then(function(){
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
