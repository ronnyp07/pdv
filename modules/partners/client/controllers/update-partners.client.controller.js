(function () {
  'use strict';

  // Partners controller
  angular
  .module('partners')
  .controller('PartnersUpdateController', PartnersUpdateController);

  PartnersUpdateController.$inject = ['$scope',  'Authentication',  'FileUploader', '$window', 'PartnersService', 'PartnersRestServices', '$state', '$timeout', '$stateParams', 'Notify'];

  function PartnersUpdateController ($scope,  Authentication, FileUploader, $window, PartnersService, PartnersRestServices, $state, $timeout, $stateParams, Notify) {
    var vm = this;
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.partnerServices = PartnersRestServices;
    vm.partnerServices.partner = PartnersService.get({partnerId: $stateParams.partnerId}, function(data){
    vm.imageURL = data.picturesURL ? data.picturesURL : 'modules/core/img/no-imagen.jpg';
    });

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
   vm.partnerServices.partner.modeOn = 'update';
   item.formData.push(vm.partnerServices.partner);
 };

 // Cancel the upload process
 vm.cancel = function(){
  vm.uploader.cancelAll();
  vm.uploader.clearQueue();
  vm.imageURL = 'modules/core/img/no-imagen.jpg';
 };

 vm.cancelForm = function(){
  $state.go('partners.list');
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

vm.savePartner = function(partner, isValid){
    if ( isValid){
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
        alertify.success('Acción realizada exitosamente!!');
        Notify.sendMsg('refreshCompany', {nothing: ''});
        $state.go('partners.list');
      }else{
         vm.partnerServices.update(partner).then(function(){
          Notify.sendMsg('refreshCompany', {nothing: ''});
         $state.go('partners.list');
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
