'use strict';

var productModule = angular.module('parameters')
.controller('ProductsController',
  ['productsService',
  '$scope',
  'ProductRestServices',
  '$http',
  '$q',
  'NgTableParams',
  '$modal',
  '$timeout',
  '$window',
  'Authentication',
  'FileUploader',
  '$state',
  'ParameterRestServices',
  'SucursalsService',
  function ProductsListController(
    productsService,
    $scope,
    ProductRestServices,
    $http,
    $q,
    NgTableParams,
    $modal,
    $timeout,
    $window,
    Authentication,
    FileUploader,
    $state,
    ParameterRestServices,
    SucursalsService) {

    var vm = this;
  // vm.user = Authentication.user;

  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
  vm.paramRestServices = ParameterRestServices;
  vm.sucursalList = SucursalsService.query();
  vm.productServices = ProductRestServices;
  vm.productServices.minimumStock = 0;
  vm.productServices.maximumStock = 0;
  init();


   // Create file uploader instance
   vm.uploader = new FileUploader({
    url: '/api/products'
  });

   function init(){
    vm.productServices.product= {};
    vm.productServices.product.cost = 0;
    vm.productServices.product.price = 0;
    vm.productServices.product.isActive = true;
    vm.productServices.product.isPOS = true;
    vm.productServices.product.listProductPromotion = [];
    vm.tempPromotion = {};
    vm.imageURL = 'modules/products/img/no-imagen.jpg';
  }

  vm.product = productsService.query();
   // vm.paramRestServices.product.isActive = true;
   vm.product = {};
   vm.product.qt = 1;

   var params = {
    page: 1,
    count: 3
  };

  vm.getTotal = function($index){
    console.log($index);
  };

  vm.editAppKey = function(field) {
    vm.product.Editvalue = field.qt;
    vm.productServices.tempSelectedProduct = field;
  };

  vm.tableParams = new NgTableParams({}, {
    dataset: angular.copy(vm.productServices.listProductPromotion)
  });

  vm.saveField = function(index, product) {
    if(vm.editMode){
      vm.productServices.product.listProductPromotion[index].total = Number(vm.product.Editvalue) * Number(product.price);
      vm.productServices.product.listProductPromotion[index].qt = Number(vm.product.Editvalue);
      vm.product.Editvalue = null;
    }
  };

  // Set file uploader image filter
  vm.uploader.filters.push({
    name: 'imageFilter',
    fn: function (item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

  vm.uploader.onBeforeUploadItem = function (item) {
    vm.productServices.product.sucursalId = vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
   item.formData.push(vm.productServices.product);
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

vm.saveProduct = function(product, isValid){
  if(vm.authentication.sucursal === 'superUser' && !vm.productServices.product.sucursalId){
    alertify.error('Seleccionar almacen!!');
  }else{
    if ( isValid) {
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
      }else{
        product.sucursalId =  vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId : vm.authentication.sucursal.sucursalId._id;
        vm.productServices.create(product).then(function(){
         init();
         alertify.success('Acción realizada exitosamente!!');
       }, function(err){
         alertify.error(err.data.message);
       });
      }
    }else{
      alertify.error('Completar los campos requeridos');
    }
  }
};

vm.addToCart = function(product){
  product.qt = Number(vm.product.qt) === null ? Number(vm.product.qt) : 1 ;
  product.total = Number(product.qt) * Number(product.price);
  vm.productServices.product.listProductPromotion.push({product: product._id, name: product.name, qt: product.qt, total: product.total, cost: product.cost, price: product.price});
  resetPromoForm();
};

vm.selectedProduct = function(product){
 if(vm.productServices.product.listProductPromotion.length > 0){
  if(_.findIndex(vm.productServices.product.listProductPromotion, function(o) { return o.product === product._id; }) >=0){
   var index = _.findIndex(vm.productServices.product.listProductPromotion, function(o) { return o.product === product._id; });
   vm.productServices.product.listProductPromotion[index].qt += Number(vm.product.qt) ? Number(vm.product.qt) : 1;
   vm.productServices.product.listProductPromotion[index].total = Number(vm.productServices.product.listProductPromotion[index].qt) * Number(product.price);
   vm.productServices.product.promotionItems= null;
   vm.product.qt = 1;
 }else{
   vm.addToCart(product);
 }
}else{
 vm.addToCart(product);
}
};


function resetPromoForm(){
 vm.productServices.product.promotionItems= null;
 vm.product.qt = 1;
}
    // Cancel the upload process
    vm.cancelUpload = function(){
      vm.uploader.cancelAll();
      vm.uploader.clearQueue();
    };

    vm.deletePromoItem = function(index) {
     vm.productServices.product.listProductPromotion.splice(index, 1);
   };

 vm.cancel = function(){
    vm.uploader.cancelAll();
    vm.uploader.clearQueue();
    vm.imageURL = 'modules/products/img/no-imagen.jpg';
  };

  vm.cancelForm = function(){
    $state.go('products.list');
  };
    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      if(response.productPromotion){
       response.listProductPromotion = vm.productServices.product.listProductPromotion;
       vm.productServices.updateProduct(response).then(function(){
        init();
      });
     }
      // Show success message
      vm.success = true;
      // Populate user object
      vm.user = Authentication.user = response;
      // Clear upload buttons
      vm.cancel();
    };

  // Cancel the upload process
  vm.cancelUpload = function () {
    vm.uploader.clearQueue();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

    vm.notResult = function(){
      console.log('not result');
    };

    var settings = {
     filterDelay: 300,
     total: 0,
     getData: function(params) {
      return productsService.get(params.url()).$promise.then(function(data) {
        $scope.total = data.total;
        params.total(data.total);
        return data.results;
      });
    }
  };

  /* jshint ignore:start */
  $scope.tableParams = new NgTableParams({}, settings);
  $scope.test = function(){
   console.log('test');
 };

 $scope.createProduct = function(product, valid){
  if(valid){
    if(vm.productServices.saveMode === 'create'){
      vm.paramRestServices.create(vm.paramRestServices.product).then(function(){
        vm.createModal.hide();
        vm.reloadList();
        alertify.success('Acción realizada exitosamente!!');
      }, function(){
        alertify.error('Ha ocurrido un error en el sistema!!');
      });
    }
    if(vm.productServices.saveMode === 'update'){
      vm.paramRestServices.updateProduct(vm.paramRestServices.product).then(function(){
        vm.createModal.hide();
        vm.reloadList();
        alertify.success('Acción realizada exitosamente!!');
        vm.productServices.saveMode = '';
      });
    }
  }else{
    alertify.error('Informacion incompleta!!');
  }
};

vm.delete = function(product){
  if(product.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');

  }else{
    vm.productServices.delete(product).then(function(data){

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

  $http.post('/api/productfilter', data)
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

