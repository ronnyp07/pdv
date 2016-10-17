(function () {
  'use strict';

  // Compras controller
  angular
  .module('compras')
  .controller('ComprasController', ComprasController);

  ComprasController.$inject =
  ['ComprasService',
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
  'SucursalListServices'];
  function ComprasController (
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
    SucursalListServices) {
    var vm = this;

    vm.compraServices = ComprasRestServices;
    vm.compraServices.compras = {};
    vm.authentication = Authentication;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.paramRestServices = ParameterRestServices;
    vm.inventoryServices = InventoryRestServices;

    vm.inventoryServices.saveMode = 'create';
    vm.sucursalList = SucursalListServices.query();
    vm.paramRestServices.getParamsFilterByParent('', vm.paramRestServices.paramEnum.headers.tipo_factura).then(function(data){
     vm.tipoFacturaList = data;
     vm.compraServices.compras.documentType = vm.paramRestServices.paramEnum.details.tipo_factura_factura;
   });

    vm.paramRestServices.getParamsFilterByParent('', vm.paramRestServices.paramEnum.headers.tipo_pago).then(function(data){
     vm.tipoPagoList = data;
     vm.compraServices.compras.tipoPago = vm.paramRestServices.paramEnum.details.tipo_pago_efectivo;
   });
    vm.productServices = ProductRestServices;
    vm.providerServices = ProviderRestServices;

    //vm.compraServices.compras.createdDate = Date.now();
    vm.compraServices.compras.fecha_compra = new Date(moment());

    vm.product = {};
    vm.productServices.product.listproductPromotion = [];
    vm.cartService = cartService;
    vm.cartService.self.state = 'compra';
    vm.product.qt = 1;
    vm.product.total = 0;
    vm.product.itbs = 0;
    vm.product.subtotal = 0;


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
    //Search the product
    vm.getProductFilter = function(param){
      var defer = $q.defer();
      var parm = {
        bardCode: param,
        sucursalId: vm.compraServices.compras.sucursalId ? vm.compraServices.compras.sucursalId : vm.authentication.sucursal.sucursalId._id
      };
      vm.productServices.getProductFilter(parm)
      .then(function(data){
        defer.resolve(data);
      });
      return defer.promise;
    };

   //update product row
   vm.saveField = function(index, product) {
    if(vm.editMode){
      vm.productServices.product.listProductPromotion[index].total = Number(vm.product.Editvalue) * Number(product.cost);
      vm.productServices.product.listProductPromotion[index].qt = Number(vm.product.Editvalue);
      vm.product.Editvalue = null;
    }
  };

  vm.selectedItem = function(product){
    vm.cartService.addToCart(product, vm.product.qt).then(function(data){
      vm.productServices.product.listproductPromotion = data.items;
      vm.compraServices.compra.promotionItems = null;
      vm.product.subtotal = vm.cartService.getSubTotal(data.items);
      vm.product.total = vm.cartService.getTotalCart();
      vm.product.itbs = vm.cartService.getTotalTax();
      vm.product.qt = 1;
    });
  };

  vm.saveOrder = function(order){
    order.sucursalId = vm.compraServices.compras.sucursalId ? vm.compraServices.compras.sucursalId : vm.authentication.sucursal.sucursalId._id;
    order.cart = vm.productServices.product.listproductPromotion;
    order.itbs = vm.product.itbs;
    order.subtotal = vm.product.subtotal;
    order.total = vm.product.total;
    order.fecha_compra = moment(order.fecha_compra).format();
    order.status = vm.paramRestServices.paramEnum.details.compra_status_pendiente;
    vm.compraServices.create(order).then(function(){
       vm.clearCart();
       vm.compraServices.compras = {};
       vm.compraServices.compras.documentType = vm.paramRestServices.paramEnum.details.tipo_factura_factura;
       vm.compraServices.compras.tipoPago = vm.paramRestServices.paramEnum.details.tipo_pago_efectivo;
       alertify.success('Acción realizada exitosamente!!');
    }, function(err){
       console.log(err);
       alertify.error('Ha ocurrido un error en el sistema!!');
    });
  };

  vm.removeItem = function(item){
   vm.cartService.removeFromCart(item).then(function(){
    var cart = vm.cartService.getCart();
    vm.productServices.product.listproductPromotion = cart.items;
  });
 };

 vm.editAppKey = function(field) {
  console.log(field);
  vm.product.Editvalue = field.quantity;
  vm.product.EditvaluePrices = field.cost;
  vm.productServices.tempSelectedproduct = field;
};

vm.saveField = function(index, product) {
  if(vm.editMode){
   vm.cartService.updateItemQuantityByIndex(index, vm.product.Editvalue).then(function(data){
    vm.product.subtotal = vm.cartService.getSubTotal(data);
    vm.product.total = vm.cartService.getTotalCart();
    vm.product.itbs = vm.cartService.getTotalTax();
    vm.product.Editvalue = null;
  });
 }
};

vm.saveFieldPrices = function(index, product){
 if(vm.editModePrices){
  vm.cartService.updateItemCost(index, vm.product.EditvaluePrices).then(function(data){
    vm.product.subtotal = vm.cartService.getSubTotal(data);
    vm.product.total = vm.cartService.getTotalCart();
    vm.product.itbs = vm.cartService.getTotalTax();
    vm.product.EditvaluePrices = null;
  });
}
};

vm.clearCart = function(){
  vm.cartService.resetCart().then(function(data){
    vm.productServices.product.listproductPromotion = [];
    vm.product.subtotal = vm.cartService.getSubTotal(data.items);
    vm.product.total = vm.cartService.getTotalCart();
    vm.product.itbs = vm.cartService.getTotalTax();
  });
};
}
})();
