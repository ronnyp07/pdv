(function () {
  'use strict';

  // Partners controller
  angular
  .module('partners')
  .controller('PartnersController', PartnersController);

  PartnersController.$inject = ['$scope',  'Authentication',  'FileUploader', '$window', 'PartnersRestServices', '$state', '$timeout'];

  function PartnersController ($scope,  Authentication, FileUploader, $window, PartnersRestServices, $state, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.imageURL = 'modules/core/img/no-imagen.jpg';
    vm.partnerServices = PartnersRestServices;
    vm.partnerServices.partner = {};
    vm.partnerServices.partner.isActive = true;
  // Create file uploader instance
  vm.uploader = new FileUploader({
    url: '/api/partners'
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
   item.formData.push(vm.partnerServices.partner);
 };

 // Cancel the upload process
 vm.cancel = function(){
  vm.uploader.cancelAll();
  vm.uploader.clearQueue();
  vm.imageURL = 'modules/core/img/no-imagen.jpg';
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

vm.savePartner = function(Partner, isValid){
    if ( isValid){
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
      }else{
        vm.partnerServices.create(Partner).then(function(){
         init();
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
