'use strict';

var productModule = angular.module('parameters')
.controller('ProductsListController', ['productsService', '$scope', 'ProductRestServices', '$http', '$q', 'NgTableParams', '$modal', '$timeout', '$window', 'Authentication', 'FileUploader', '$state', 'SucursalsService', 'Notify', 'SucursalListServices', 'LotesRestServices',  function ProductsListController(productsService, $scope, ProductRestServices, $http, $q, NgTableParams, $modal, $timeout, $window, Authentication, FileUploader, $state, SucursalsService, Notify, SucursalListServices, LotesRestServices) {

  var vm = this;
  // vm.user = Authentication.user;
  vm.imageURL = 'modules/users/img/profile/default.png';
  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
   // Create file uploader instance

   vm.product = productsService.query();
   vm.paramRestServices = ProductRestServices;
   vm.productServices = ProductRestServices;
   vm.loteServices = LotesRestServices;
   vm.productServices.selectedProduct = null;
   vm.sucursalList = SucursalListServices.query();
   vm.loteServices.product = {};
   vm.lote = {};
   vm.lotesForm = {};

   vm.loadMore = function(newPages, oldPage){
     vm.productServices.selectedProduct = null;
     vm.productServices.page = newPages;
     vm.productServices.loadMore();
   };

   vm.search = function(){
    vm.productServices.selectedProduct = null;
    vm.productServices.hasMore = true;
    vm.productServices.page = 1;
    vm.productServices.total = 0;
    vm.productServices.count= 15;
    vm.productServices.sucursalSearch = vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId._id: null;
    vm.productServices.loadproducts();
  };

  vm.loadMoreLotes = function(newPages, oldPage){
    if(vm.productServices.selectedProduct !== null){
     vm.loteServices.productId = vm.productServices.selectedProduct._id;
     vm.loteServices.page = newPages;
     vm.loteServices.loadMore();
   }
 };

 vm.searchLotes = function(){
   vm.loteServices.hasMore = true;
   vm.loteServices.page = 1;
   vm.loteServices.total = 0;
   vm.loteServices.count= 100;
   vm.productServices.sucursalSearch = vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId._id: null;
   vm.loteServices.loadlotes();
 };

 vm.edit = function(product){
   $state.go('products.edit', {productId:product._id});
   vm.productServices.saveMode = 'update';
 };

 Notify.getMsg('refreshProduct',function(event, data){
  vm.productServices.hasMore = true;
  vm.productServices.page = 1;
  vm.productServices.total = 0;
  vm.productServices.count= 15;
  vm.productServices.loadproducts();
});

 vm.showAjustarModal = function(product){
  if(vm.productServices.selectedProduct !== null){
    vm.loteServices.product.inStock = !vm.productServices.selectedProduct.inStock  ? '' : vm.productServices.selectedProduct.inStock;
    vm.loteServices.product.stockDescription = !vm.productServices.selectedProduct.stockDescription  ?  '' : vm.productServices.selectedProduct.stockDescription;
    vm.ajustarModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/ajustar.html',
     show: true,
     backdrop: 'static'
   });
  }
};

  //Action de la pantalla del listado de lotes
  vm.createLotesModel = function(){
  //alertify.alert('This is an alert dialog.').setHeader('<i class="fa fa-plus"></i> ');
  vm.showNewLoteModal();
};

 //Abre la pantalla del listado de lotes
 vm.showLotesModal = function(product){
  if(vm.productServices.selectedProduct !== null){
    vm.lotesModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/lotes.html',
     show: true,
     backdrop: 'static'
   });
  }
};

 //Abre el formulario para los nuevos lotes
 vm.showNewLoteModal = function(product){
  if(product !== null &&  vm.loteServices.product.loteRest > 0){
    vm.lotesForm.noLote = '';
    vm.lotesForm.loteDateCaducidad = new Date();
    vm.lotesForm.loteDateCreated = new Date();
    vm.lotesForm.category = product.category;
    vm.lotesForm.productId = product._id;
    vm.lotesForm.exFinal = vm.loteServices.product.loteRest;
    vm.newlotesModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/newLotes.html',
     show: true,
     backdrop: 'static'
   });
  }
};

 //cierra la pantalla de Ajustar existencia
 vm.cancelAjustarModal = function(){
   vm.ajustarModal.hide();
 };
 //Cierre la pantalla de ajustar listado de lotes
 vm.cancelLotesModal = function(){
   if(vm.loteServices.product.loteRest !== 0){
    vm.lotesModal.hide();
    alertify.alert('No se pudo realizar los cambios en lotes').setHeader('<i class="fa fa-warning"></i> ');
  }else{
    vm.lotesModal.hide();
  }
};
 //Cierre la pantalla de ajustar nuevo lote
 vm.cancelNewLotesModal = function(){
  vm.lotesForm = {};
  vm.newlotesModal.hide();
};

 //Guarda los cambios en la pantalla de ajuste de lotes
 vm.saveAjustarModal = function(product){
  if(product.lotes && vm.loteServices.product.inStock){
    vm.loteServices.product.name = product.name;
    var param = {
      productId : product._id
    };
    vm.loteServices.getLoteFilter(param).then(function(data){
     vm.loteServices.currentStuck(data);
           //vm.loteServices.product.loteRest = vm.loteServices.product.inStock - vm.loteServices.totalLoteProduct(data);
           vm.showLotesModal();
         });
  }else{
    if(vm.loteServices.product.inStock){
      if(vm.loteServices.product.inStock !== vm.productServices.selectedProduct.inStock){
       vm.productServices.selectedProduct.inStock = vm.loteServices.product.inStock;
       vm.productServices.updateProduct(vm.productServices.selectedProduct).then(function(){
         vm.productServices.selectedProduct = null;
         vm.ajustarModal.hide();
         alertify.success('Acción realizada exitosamente!!');
       },function(err){
         alertify.error('Se ha producido un error en el sistema');
       });
     }else{
        vm.productServices.selectedProduct = null;
        vm.ajustarModal.hide();
        alertify.success('Acción realizada exitosamente!!');
     }
   }
 }
};

  //Guardar lotes cambios
  vm.saveLotes = function(lotes){
    //aqui tienes que comparar los loteRest con el nuevo valor
    var productStock = Number(vm.loteServices.product.inStock);
    if(vm.loteServices.product.loteRest  <  0){
      alertify.alert('La existencia es menor a lo registrado').setHeader('<i class="fa fa-warning"></i> ');
    }else if (vm.loteServices.product.loteRest > 0) {
      alertify.alert('La existencia es mayor a los lotes registrados').setHeader('<i class="fa fa-warning"></i> ');
    }else{
     if(vm.loteServices.lotesList.length > 0)
      vm.loteServices.createLotes(vm.loteServices.lotesList).then(function(){
       if(vm.loteServices.product.inStock  !== vm.productServices.selectedProduct.inStock){
        vm.productServices.selectedProduct.inStock = vm.loteServices.product.inStock;
        vm.productServices.updateProduct(vm.productServices.selectedProduct).then(function(){
         vm.productServices.selectedProduct = null;
         vm.lotesModal.hide();
         vm.ajustarModal.hide();
         alertify.success('Acción realizada exitosamente!!');
       });
      }else{
        vm.productServices.selectedProduct = null;
        vm.lotesModal.hide();
        vm.ajustarModal.hide();
        alertify.success('Acción realizada exitosamente!!');
      }
    },function(){
     alertify.alert('Se ha producido un error!!').setHeader('<i class="fa fa-plus"></i> ');
   });
  }
};

  //Guardar nuevos lotes
  vm.saveNewLotes = function(valid){
   if(!valid){
    if(vm.lotesForm.loteDateCaducidad >= vm.lotesForm.loteDateCreated){
      var prodcutStock = Number(vm.loteServices.product.inStock);
      if(Number(vm.lotesForm.exFinal) > vm.loteServices.product.loteRest){
        alertify.alert('La existencia excede la cantidad total registrada ' + vm.loteServices.product.loteRest).setHeader('<i class="fa fa-warning"></i> ');
      }else if (vm.lotesForm.exFinal === undefined){
        alertify.alert('La existencia de lote es requerida').setHeader('<i class="fa fa-warning"></i> ');
      }else{
        vm.lotesForm.action = 'n';
        vm.lotesForm.exInicial = vm.lotesForm.exFinal;
        vm.lotesForm.sucursalId = vm.authentication.sucursal.sucursalId._id;
        vm.loteServices.lotesList.push(vm.lotesForm);
        vm.loteServices.currentStuck(vm.loteServices.lotesList);
        vm.newlotesModal.hide();
        vm.lotesForm = {};
      }
    }else{
     alertify.alert('Fecha final debe ser mayor a inicial').setHeader('<i class="fa fa-warning"></i> ');
   }
 }
};

  //Elimina el lote de la lista
  vm.deleteLote = function(lote){
   lote.isActive = false;
   lote.action = 'd';
   vm.loteServices.currentStuck(vm.loteServices.lotesList);
 };

 vm.showCreateProductModal = function(saveParam){
  if(!saveParam){
   vm.productServices.products = {};
   vm.productServices.saveMode = 'create';
 }else{
   vm.productServices.saveMode = 'update';
   vm.productServices.product = saveParam;
 }
 $state.go('products.create');
};

//Prepara el formulario para editar el lote
vm.editAppKey = function($index, field) {
  vm.lote.Editvalue = field.exFinal;
  vm.loteServices.loteSelected = field;
  vm.loteServices.loteSelected.index = $index;
};

//Guarda los cambios al editar el lote
vm.saveLoteEditable = function($index, lote){
  if(vm.lote.Editvalue){
    lote.action = 'u';
    vm.loteServices.updateItemQuantityByIndex($index, vm.lote.Editvalue);
    vm.loteServices.currentStuck(vm.loteServices.lotesList);
  }
};

/* jshint ignore:start */
$scope.$watch(function () {
 return vm.valuationDatePickerIsOpen;
},function(value){
});
vm.valuationDatePickerOpen = function ($event) {
  if ($event) {
    $event.preventDefault();
        $event.stopPropagation(); // This is the magic
      }
      vm.valuationDatePickerIsOpen = true;
    };
     // Handle Calendar popup
     $scope.$watch(function () {
       return vm.valuationDatePickerIsOpen1;
     },function(value){
     });
     vm.valuationDatePickerOpen1 = function ($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // This is the magic
      }
      vm.valuationDatePickerIsOpen1 = true;
    };
  }
  ]);

