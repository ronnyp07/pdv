'use strict';

var productModule = angular.module('parameters')
.controller('ProductsListController', ['productsService', '$scope', 'ProductRestServices', '$http', '$q', 'NgTableParams', '$modal', '$timeout', '$window', 'Authentication', 'FileUploader', '$state', 'SucursalsService', 'Notify', 'SucursalListServices',  function ProductsListController(productsService, $scope, ProductRestServices, $http, $q, NgTableParams, $modal, $timeout, $window, Authentication, FileUploader, $state, SucursalsService, Notify, SucursalListServices) {

  var vm = this;
  // vm.user = Authentication.user;
  vm.imageURL = 'modules/users/img/profile/default.png';
  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;

   // Create file uploader instance

   vm.product = productsService.query();
   vm.paramRestServices = ProductRestServices;
   vm.productServices = ProductRestServices;
   vm.paramRestServices.product.isActive = true;
   vm.sucursalList = SucursalListServices.query();
   vm.product = {};

   vm.loadMore = function(newPages, oldPage){
     vm.productServices.page = newPages;
     vm.productServices.loadMore();
   };

   vm.search = function(){
    vm.productServices.hasMore = true;
    vm.productServices.page = 1;
    vm.productServices.total = 0;
    vm.productServices.count= 15;
    vm.productServices.sucursalSearch = vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId._id: null;
    vm.productServices.loadproducts();
  };

  Notify.getMsg('refreshProduct',function(event, data){
    vm.productServices.hasMore = true;
    vm.productServices.page = 1;
    vm.productServices.total = 0;
    vm.productServices.count= 15;
    vm.productServices.loadproducts();
  });

  vm.showCreateProductModal = function(saveParam){
    if(!saveParam){
     vm.productServices.products = {};
     vm.productServices.saveMode = 'create';
   }else{
     vm.productServices.saveMode = 'update';
     vm.productServices.product = saveParam;
   }
   $state.go("products.create");
 };

 /* jshint ignore:start */

 vm.delete = function(product){
  if(product.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');

  }else{
    vm.paramRestServices.delete(product).then(function(){
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};

}
]);

