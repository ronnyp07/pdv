(function () {
  'use strict';

  angular
  .module('compras')
  .controller('ComprasOrdersController', ComprasOrdersController);

  ComprasOrdersController.$inject = [
  'ComprasService',
  'ComprasRestServices',
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
  'cartService',
  'ProviderRestServices',
  'compraResolve',
  'SucursalListServices'];

  function ComprasOrdersController(
  	ComprasService,
    ComprasRestServices,
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
    cartService,
    ProviderRestServices,
    compraResolve,
    SucursalListServices) {
    var vm = this;


    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.productServices = ProductRestServices;
    vm.paramRestServices = ParameterRestServices;
    vm.inventoryServices = InventoryRestServices;
    vm.setCompraStatus = compraResolve;
    vm.setCompraStatus.setStatus('PENDIENTE');
    vm.compraServices = ComprasRestServices;
    vm.compraServices.startDate = new Date(moment().subtract(1, 'months').endOf('month').format('MM/DD/YYYY'));
    vm.compraServices.endDate = new Date();
    vm.providerServices = ProviderRestServices;
    vm.sucursalList = SucursalListServices.query();


    vm.loadMore = function(newPage, oldPage){
     vm.compraServices.page = newPage;
     vm.compraServices.loadCompras(newPage);
   };

   vm.removeItem = function(compra){
    vm.compraServices.delete(compra).then(function(){
      vm.compraServices.doSearch();
     });
   };

   vm.doSomething = function(){
     vm.compraServices.doSearch();
   };

   vm.searchSucursal = function(){
    vm.compraServices.sucursalSearch = vm.compraServices.compra.sucursalSearch ? vm.compraServices.compra.sucursalSearch._id: '';
    vm.compraServices.doSearch();
  };

vm.reciveOrder = function(compra){
   vm.inventoryServices.getMaxInventory(compra.sucursalId._id)
   .then(function(data){
    if(data.length > 0){
      compra.status = vm.paramRestServices.paramEnum.details.compra_status_entrada;
      vm.inventoryServices.updateFields(compra.cart, data[0]).then(function(inventory){
       vm.productServices.incrementProductStuck(compra.cart).then(function(){
          vm.compraServices.update(compra).then(function(){
            vm.compraServices.doSearch();
            alertify.success('Acción realizada exitosamente!!');
          }, function(err){
           console.log(err);
            alertify.error('Se ha producido un error, por favor intentar nuevamente');
          });
       });
   });
    }
 });

 };

 /*Call model popUP Display items list */
 vm.showItems = function(compra){
  vm.createModal = $modal({
   scope: $scope,
   'templateUrl': 'modules/compras/partials/carts-order.html',
   show: true
             // placement: 'center'
           });

  vm.compraServices.compraSelected = compra;
};

vm.openProviderWindows = function(){
 vm.compraServices.providerWindowOpen = !vm.compraServices.providerWindowOpen;
};


    // Handle Calendar popup
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
})();
