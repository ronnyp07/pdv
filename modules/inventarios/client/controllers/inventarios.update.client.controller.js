'use strict';

var inventoryModule = angular.module('inventarios')
.controller('InventariosUpdateController',
  ['InventariosService',
  '$scope',
  'InventoryRestServices',
  '$http',
  '$q',
  'NgTableParams',
  '$modal',
  '$timeout',
  'Authentication',
  '$state',
  'ParameterRestServices',
  'ProductRestServices',
  'SucursalsService',
  '$stateParams',
  function(
    InventariosService,
    $scope,
    InventoryRestServices,
    $http,
    $q,
    NgTableParams,
    $modal,
    $timeout,
    Authentication,
    $state,
    ParameterRestServices,
    ProductRestServices,
    SucursalsService,
    $stateParams) {

    var vm = this;
  // vm.user = Authentication.user;

  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
  vm.paramRestServices = ParameterRestServices;
  vm.inventoryServices = InventoryRestServices;
  vm.inventoryServices.saveMode = 'update';
  vm.sucursalList = SucursalsService.query();
  vm.productServices = ProductRestServices;
  vm.inventoryServices.importInfo = {};


  vm.inventoryServices.inventory = InventariosService.get({inventarioId: $stateParams.inventarioId}, function(data){
    vm.inventoryServices.inventory.createdDate = new Date(data.createdDate);
    vm.authentication.selectedSucural = SucursalsService.get({sucursalId: data.sucursalId});
  });
  vm.product = {};
  vm.product.qt = 1;
  vm.inventory = {};
  vm.inventory.qt = 1;

  vm.getTotal = function($index){
    console.log($index);
  };

  vm.cancelInventory = function(){
   resetPromoForm();
   $state.go('inventarios.list');
  };


 /*
    Add the param item to the array list.
   == affective variable vm.inventoryServices.inventory.listinventoryPromotion
   */
   vm.addToCart = function(inventory, almacen){
    if(vm.inventoryServices.importInfo.resetStock){
     inventory.inStock = 0;
   }
   vm.inventoryServices.inventory.listinventoryPromotion.push({inventory: inventory._id, productId: inventory.productId, name: inventory.name, marca: inventory.brand,  saldoIni: almacen ? inventory.inStock: vm.inventory.qt, entrada: 0, salida: 0, saldo: 0});
   resetPromoForm();
 };

 vm.selectedinventory = function(inventory, almacen){
  if(vm.inventoryServices.inventory.listinventoryPromotion.length > 0){
    if(_.findIndex(vm.inventoryServices.inventory.listinventoryPromotion, function(o) { return o.inventory === inventory._id; }) >=0){
      var index = _.findIndex(vm.inventoryServices.inventory.listinventoryPromotion, function(o) { return o.inventory === inventory._id; });
      vm.inventoryServices.inventory.listinventoryPromotion[index].saldoIni += almacen === true ? inventory.inStock : Number(vm.inventory.qt);
      vm.inventoryServices.inventory.listinventoryPromotion[index].entrada = 0;
      vm.inventoryServices.inventory.listinventoryPromotion[index].salida = 0;
      vm.inventoryServices.inventory.listinventoryPromotion[index].saldo  = 0;
      vm.inventoryServices.inventory.promotionItems= null;
      vm.inventory.qt = 1;
    }else{
      if(almacen){
        vm.addToCart(inventory, true);
      }else{
        vm.addToCart(inventory);
      }
    }
  }else{
    if(almacen){
      vm.addToCart(inventory, true);
    }else{
      vm.addToCart(inventory);
    }
  }
};

vm.editAppKey = function(field) {
  vm.inventory.Editvalue = field.saldoIni;
  vm.inventoryServices.tempSelectedInventory = field;
};

/*
   Recive as parameter the index and the field and update the quantity of the product
   */
   vm.saveField = function(index, product) {
    if(vm.editMode){
      vm.inventoryServices.inventory.listinventoryPromotion[index].saldoIni = Number(vm.inventory.Editvalue);
      vm.product.Editvalue = null;
    }
  };

  /*Filter the product by the name or the code */
  vm.getProductFilter = function(param){
    var defer = $q.defer();
    var parm = {
      bardCode: param,
      sucursalId: vm.inventoryServices.inventory.sucursalId ? vm.inventoryServices.inventory.sucursalId : vm.authentication.sucursal.sucursalId._id
    };
    vm.productServices.getProductFilter(parm)
    .then(function(data){
      defer.resolve(data);
    });
    return defer.promise;
  };

  vm.deletePromoItem = function(index) {
    vm.inventoryServices.inventory.listinventoryPromotion.splice(index, 1);
  };

  vm.notResult = function(){
    console.log('not result');
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  function disabled(data) {
    var date = data.date,
    mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.format = 'yyyy/MM/dd';
   //Function to open the calendar
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


    function resetPromoForm(){
     vm.inventoryServices.inventory.promotionItems = null;
     vm.inventory.qt = 1;
   }

   vm.showcreateInventoryModal = function(saveParam){
     vm.createModal = $modal({
       scope: $scope,
       'templateUrl': 'modules/inventarios/partials/template.savemodel.tpl.html',
       show: true
             // placement: 'center'
           });
   };


   vm.search = function(query){
    var defer = $q.defer();
    vm.paramRestServices.getParameterfilterByAncestor('categoria').then(function(data){
     defer.resolve(data);
   });
    return defer.promise;
  };

  vm.importCurrentInventory = function(filterByCategory){
   if(filterByCategory && !vm.inventoryServices.importInfo.categories){
    alertify.error('Categorias requeridas');
  }else{
    vm.inventoryServices.isLoading = true;
    vm.inventoryServices.inventory.listinventoryPromotion = [];

    var param = {
      sucursalId : vm.inventoryServices.inventory.sucursalId,
      categories: vm.inventoryServices.importInfo.categories ? vm.inventoryServices.importInfo.categories : null
    };

    vm.productServices.filterProductBySucursal(param).then(function(data){
      angular.forEach(data, function(item){
        vm.selectedinventory(item, true);
      });
    });
    vm.inventoryServices.isLoading = false;
    vm.resetImportForm();
    vm.createModal.hide();
    alertify.success('Inventario agregado!!');
  }
};

vm.resetImportForm = function(){
  vm.inventoryServices.importInfo.categories = null;
};

vm.resetFormSubmit = function(){
 vm.authentication.selectedSucural = vm.inventoryServices.inventory.sucursalId;
 vm.inventoryServices.inventory.listinventoryPromotion = [];
};

vm.saveInventory = function(){
  if(vm.inventoryServices.saveMode === 'update'){
    console.log(vm.inventoryServices.inventory);
    vm.inventoryServices.update(vm.inventoryServices.inventory).then(function(){
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};


/*Validate the inventory
Accion: search the last inventory with the status active update it by status cerrado,
        update the current inventory to status active
        */
        vm.validateInventory = function(){
          vm.inventoryServices.getMaxInventory(vm.inventoryServices.inventory.sucursalId).then(function(data){
            if(data.length > 0){
             data[0].status = vm.paramRestServices.paramEnum.inventoryStatus.cerrado;
             vm.inventoryServices.update(data[0]).then(function(){
              vm.inventoryServices.inventory.status = vm.paramRestServices.paramEnum.inventoryStatus.activo;
              vm.inventoryServices.update(vm.inventoryServices.inventory).then(function(){
                alertify.success('Acción realizada exitosamente!!');
              });
            }, function(error){
             console.log(error);
           });
           }else{
            vm.inventoryServices.inventory.status = vm.paramRestServices.paramEnum.inventoryStatus.activo;
            vm.inventoryServices.update(vm.inventoryServices.inventory).then(function(){
              alertify.success('Acción realizada exitosamente!!');
            });
          }
        }, function(err){
          console.log(err);
          alertify.error('Se ha producido un error, por favor contacte el administrador del sistema');
        });
        };

      }]);



