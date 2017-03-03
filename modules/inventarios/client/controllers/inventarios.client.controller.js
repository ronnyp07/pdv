'use strict';

var inventoryModule = angular.module('inventarios')
.controller('InventariosController',
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
    SucursalsService) {

    var vm = this;
  // vm.user = Authentication.user;

  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
  vm.paramRestServices = ParameterRestServices;
  vm.inventoryServices = InventoryRestServices;
  vm.inventoryServices.saveMode = 'create';
  vm.sucursalList = SucursalsService.query();
  vm.productServices = ProductRestServices;
  vm.productServices.product.listProductPromotion = [];
  vm.inventoryServices.importInfo = {};
  vm.inventoryServices.inventory = {};
  vm.inventoryServices.inventory.createdDate = Date.now();
  vm.product = {};
  vm.product.qt = 1;

  init();

  function init(){
    vm.inventoryServices.inventory.cost = 0;
    vm.inventoryServices.inventory.price = 0;
    vm.inventoryServices.inventory.listinventoryPromotion = [];
    vm.tempPromotion = {};

    vm.imageURL = 'modules/inventorys/img/no-imagen.jpg';
  }

  vm.inventory = {};
  vm.inventory.qt = 1;

  var params = {
    page: 1,
    count: 3
  };

  vm.getTotal = function($index){
    console.log($index);
  };


  vm.tableParams = new NgTableParams({}, {
    dataset: angular.copy(vm.inventoryServices.listinventoryPromotion)
  });

  vm.saveField = function(index, inventory) {
    if(vm.editMode){
      vm.inventoryServices.inventory.listinventoryPromotion[index].total = Number(vm.inventory.Editvalue) * Number(inventory.price);
      vm.inventoryServices.inventory.listinventoryPromotion[index].qt = Number(vm.inventory.Editvalue);
      vm.inventory.Editvalue = null;
    }
  };

  vm.showcreateInventory = function(saveParam){
    if(!saveParam){
      vm.inventoryServices.inventory = {};
      vm.inventoryServices.saveMode = 'create';
    }else{
      vm.inventoryServices.saveMode = 'update';
      vm.inventoryServices.inventory = saveParam;
    }
    $state.go('inventarios.create');
  };


  vm.search = function(query){
    var defer = $q.defer();
    vm.paramRestServices.getParameterfilterByAncestor('categoria').then(function(data){
     defer.resolve(data);
   });
    return defer.promise;
  };


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
vm.saveField = function(index, product) {
  if(vm.editMode){
    vm.inventoryServices.inventory.listinventoryPromotion[index].saldoIni = Number(vm.inventory.Editvalue);
    vm.product.Editvalue = null;
  }
};
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

function resetPromoForm(){
  vm.inventoryServices.inventory.promotionItems = null;
  vm.inventory.qt = 1;
}
vm.deletePromoItem = function(index) {
  vm.inventoryServices.inventory.listinventoryPromotion.splice(index, 1);
};
vm.notResult = function(){
  console.log('not result');
};

var settings = {
  filterDelay: 300,
  total: 0,
  getData: function(params) {
    return InventariosService.get(params.url()).$promise.then(function(data) {
      $scope.total = data.total;
      params.total(data.total);
      return data.results;
    });
  }
};

/* jshint ignore:start */
$scope.tableParams = new NgTableParams({}, settings);

$scope.createinventory = function(inventory, valid){
  if(valid){
    if(vm.paramRestServices.saveMode === 'create'){
      vm.paramRestServices.create(vm.paramRestServices.inventory).then(function(){
        vm.createModal.hide();
        vm.reloadList();
        alertify.success('Acción realizada exitosamente!!');
      }, function(){
        alertify.error('Ha ocurrido un error en el sistema!!');
      });
    }
    if(vm.paramRestServices.saveMode === 'update'){
      vm.paramRestServices.updateinventory(vm.paramRestServices.inventory).then(function(){
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

vm.delete = function(inventory){
  if(inventory.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');
  }else{
    vm.paramRestServices.delete(inventory).then(function(){
      vm.reloadList();
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};

vm.reloadList = function(){
  $scope.tableParams.reload();
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

    vm.showcreateInventoryModal = function(saveParam){
     vm.createModal = $modal({
       scope: $scope,
       'templateUrl': 'modules/inventarios/partials/template.savemodel.tpl.html',
       show: true
             // placement: 'center'
           });
   };

   vm.importCurrentInventory = function(filterByCategory){
    if(filterByCategory && !vm.inventoryServices.importInfo.categories){
      alertify.error('Categorias requeridas');
    }else{
      vm.inventoryServices.isLoading = true;
      vm.inventoryServices.inventory.listinventoryPromotion = [];
      var param = {
        sucursalId : vm.inventoryServices.inventory.sucursalId ? vm.inventoryServices.inventory.sucursalId._id : vm.authentication.sucursal.sucursalId._id,
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
 vm.saveInventory = function(isValid){
  if(isValid){
    if(vm.inventoryServices.saveMode === 'create'){
      vm.inventoryServices.inventory.status = vm.paramRestServices.paramEnum.inventoryStatus.por_validar;
      vm.inventoryServices.inventory.sucursalId = vm.inventoryServices.inventory.sucursalId ? vm.inventoryServices.inventory.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
      vm.inventoryServices.create(vm.inventoryServices.inventory).then(function(){
        alertify.success('Acción realizada exitosamente!!');
        $state.go("inventarios.list");
    //vm.inventoryServices.inventory.sucursalId = vm.inventoryServices.inventory.sucursalId ? vm.inventoryServices.inventory.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
  });
    }
  }
};
vm.cancelInventory = function(){
 resetPromoForm();
 $state.go('inventarios.list');
};
}
]);



