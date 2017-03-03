'use strict';

var productModule = angular.module('parameters')
.controller('ProductsUpdateController', ['productsService', '$scope', 'ProductRestServices', '$http', '$q', 'NgTableParams', '$modal', '$timeout', '$window', 'Authentication', 'FileUploader', '$state', 'ParameterRestServices', '$stateParams', 'Notify', 'load', function ProductsListController(productsService, $scope, ProductRestServices, $http, $q, NgTableParams, $modal, $timeout, $window, Authentication, FileUploader, $state, ParameterRestServices, $stateParams, Notify, load) {

    var vm = this;
   // vm.load = load;
   vm.authentication = Authentication;
   vm.userimageURL = vm.authentication.user.profileImageURL;
   vm.paramRestServices = ParameterRestServices;
   vm.productServices = ProductRestServices;
   vm.productServices.saveMode = 'update';
   vm.newparameter = {
      ancestors: []
    };

   if(load){
    vm.productServices.companyInfo =  vm.authentication.sucursalCache.get('company');
    vm.productServices.product = load;
    vm.productServices.product.unidadVenta = {_id: load.unidadVenta, name: load.unidadVenta};
    vm.productServices.product.unidadCompra = {_id: load.unidadCompra, name: load.unidadCompra};
    vm.productServices.product.category = {_id: load.category, desc: load.category};
    vm.productServices.product.brand = {_id: load.brand, name: load.brand};
    vm.imageURL = load.picturesURL ? load.picturesURL : 'modules/products/img/no-imagen.jpg';
    vm.productServices.changeCost();
    // vm.productServices.product.taxcost = vm.productServices.amountAfterTax(vm.productServices.product.cost, vm.productServices.getTaxAmount(vm.productServices.product.cost, vm.productServices.getTax(vm.productServices.product.taxesFlag, vm.productServices.companyInfo.impuestosList)));
    // vm.productServices.product.d_cost = vm.productServices.amountAfterTax((vm.productServices.product.cost / vm.productServices.product.unidades), vm.productServices.getTaxAmount((vm.productServices.product.cost / vm.productServices.product.unidades), vm.productServices.getTax(vm.productServices.product.taxesFlag, vm.productServices.companyInfo.impuestosList)));

  }

   // Create file uploader instance
   vm.uploader = new FileUploader({
    url: '/api/products/'
  });

   function init(){
    vm.tempPromotion = {};
    vm.productServices.tempSelectedProduct = {};
  }

  init();

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
  console.log(field);
  vm.product.Editvalue = field.qt;
  vm.productServices.tempSelectedProduct = field;
};

vm.tableParams = new NgTableParams({}, {
  dataset: angular.copy(vm.productServices.listProductPromotion)
});

vm.applyNeto = function(){
  vm.productServices.resetPrices();
  if(!vm.productServices.product.neto){
    vm.productServices.getPriceNeto();
  }else {
    vm.productServices.applyTax();
  }
};

vm.saveField = function(index, product) {
  if(vm.editMode){
    vm.productServices.product.listProductPromotion[index].total = Number(vm.product.Editvalue) * Number(product.price);
    vm.productServices.product.listProductPromotion[index].qt = Number(vm.product.Editvalue);
    vm.product.Editvalue = null;
    vm.productServices.tempSelectedProduct = {};
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
    vm.productServices.product.modeOn = 'update';
    vm.productServices.product.sucursalId = vm.productServices.product.sucursalId ==="" ? vm.productServices.product.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
    vm.productServices.product.unidadCompra = vm.productServices.product.unidadCompra ? vm.productServices.product.unidadCompra._id: '';
    vm.productServices.product.unidadVenta = vm.productServices.product.unidadVenta ? vm.productServices.product.unidadVenta._id : '';
    vm.productServices.product.category = vm.productServices.product.category ? vm.productServices.product.category._id : '';
    item.formData.push(vm.productServices.product);
   //Array.prototype.push.apply(item.formData, vm.productServices.product);
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
    if ( isValid) {
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
        alertify.success('Acción realizada exitosamente!!');
        Notify.sendMsg('refreshProduct', {nothing: ''});
        $state.go('products.list');
      }else{
        vm.productServices.updateProduct(product).then(function(){
         init();
         Notify.sendMsg('refreshProduct', {nothing: ''});
         $state.go('products.list');
         alertify.success('Acción realizada exitosamente!!');
       }, function(err){
         alertify.error(err.data.message);
       });
      }
    }else{
      alertify.error('Completar los campos requeridos');
    }
  };

  $scope.addCategory = function(value){
    vm.createModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/categoria.html',
     show: true,
     backdrop: 'static'
   });
    vm.newparameter.name = value;
  };

  vm.addToCart = function(product){
    product.qt = Number(vm.product.qt) === null ? Number(vm.product.qt) : 1 ;
    product.total = Number(product.qt) * Number(product.price);
    vm.productServices.product.listProductPromotion.push({_id: product._id, name: product.name, qt: product.qt, total: product.total, cost: product.cost, price: product.price});
    resetPromoForm();
  };

  vm.selectedProduct = function(product){
    console.log(product);
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

 vm.cancelPopUp = function(value){
      vm.newparameter = {};
      vm.newparameter.newCategory = {};
      vm.createModal.hide();
 };

 vm.createParameter = function(_param, _value){
  var ancestors = [];
  vm.newparameter.companyId = vm.authentication.user.companyId;
  if(vm.newparameter.newCategory !== undefined){
    ancestors = vm.paramRestServices.joinAncestors(vm.newparameter.newCategory);
    ancestors.push(vm.newparameter.newCategory._id);
    vm.newparameter.ancestors = ancestors;
    vm.newparameter.parent = vm.newparameter.newCategory._id;
  }else{
   vm.newparameter.ancestors.push('Categoria');
   vm.newparameter.parent = 'Categoria';
 }
 vm.paramRestServices.create(vm.newparameter).then(function(data){
   vm.createModal.hide();
   console.log(data);
   vm.productServices.product.category = {_id: data._id, desc: data._id};
   alertify.success('Acción realizada exitosamente!!');
 }, function(err){
  alertify.error(err.data.message);
});
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

  // Called after the user has successfully uploaded a new picture
  vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
     response.listProductPromotion = vm.productServices.product.listProductPromotion;
     response.taxesFlag = vm.productServices.product.taxesFlag;
     response.precios = vm.productServices.product.precios;
     vm.productServices.updateProduct(response).then(function(){
      $state.go('products.list');
      Notify.sendMsg('refreshProduct', {});
    });
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

$scope.createProduct = function(product, valid){
  if(valid){
    if(vm.paramRestServices.saveMode === 'update'){
      vm.paramRestServices.updateProduct(vm.paramRestServices.product).then(function(){
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

vm.delete = function(product){
  if(product.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');
  }else{
    vm.paramRestServices.delete(product).then(function(){
      vm.reloadList();
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};

vm.cancelForm = function(){
  vm.cancel();
  vm.productServices.product = {};
  $state.go('products.list');
};

vm.reloadList = function(){
 $scope.tableParams.reload();
};

//Search the product
vm.getProductFilter = function(param){
  var defer = $q.defer();
  var parm = {
    bardCode: param,
    sucursalId: vm.authentication.sucursal === 'superUser' ? vm.productServices.product.sucursalId._id : vm.authentication.sucursal.sucursalId._id
  };
  vm.productServices.getProductFilter(parm)
  .then(function(data){
    defer.resolve(data);
  });
  return defer.promise;
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

