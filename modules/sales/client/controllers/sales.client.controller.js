(function () {
  'use strict';

  // Sales controller
  angular
  .module('sales')
  .controller('SalesController', SalesController);
  SalesController.$inject = [
  '$scope',
  '$state',
  'Authentication',
  'sales',
  'ParameterRestServices',
  'ProductRestServices',
  'InventoryRestServices',
  'CartService',
  '$q',
  'SalesRestServices',
  '$timeout',
  '$document',
  'SucursalsService',
  'CustomerRestServices',
  '$modal',
  'CreditpaysRestServices',
  'MovimientoRestServices',
  '$rootScope',
  'NcfsRestServices'];
  function SalesController (
    $scope,
    $state,
    Authentication,
    sale,
    ParameterRestServices,
    ProductRestServices,
    InventoryRestServices,
    CartService,
    $q,
    SalesRestServices,
    $timeout,
    $document,
    SucursalsService,
    CustomerRestServices,
    $modal,
    CreditpaysRestServices,
    MovimientoRestServices,
    $rootScope,
    NcfsRestServices) {
    var vm = this;
    vm.sale = sale;
    $rootScope.nav = true;
    vm.parameterServices = ParameterRestServices;
    vm.selectedCategory = 'Categoria';
    vm.authentication = Authentication;
    vm.authentication.hideNavBar = true;
    vm.userimageURL = vm.authentication.user.profileImageURL;
    vm.productServices = ProductRestServices;
    vm.cajaturnoInfo = vm.authentication.cajaturno.get('cajaturno');
    vm.focusinControl = {};
    //vm.sucursalInfo = SucursalsService.get({sucursalId: vm.sale.cajaturnoInfo.sucursalId});

    vm.productServices.sucursalSearch = vm.cajaturnoInfo.sucursalId;
    vm.customerServices = CustomerRestServices;
    vm.salesServices = SalesRestServices;
    vm.inventoryServices = InventoryRestServices;
    vm.inventoryServices.saveMode = 'create';
    vm.ncfServices = NcfsRestServices;
    vm.creditServices = CreditpaysRestServices;
    vm.movimientoServices = MovimientoRestServices;
    vm.setCategoryValue = function(value){
     vm.selectedCategory = value;
   };
   vm.parameterServices.categoryTree('Categoria');
   vm.parameterServices.getParamsFilterByParent('', vm.parameterServices.paramEnum.headers.tipo_factura).then(function(data){
     vm.tipoFacturaList = data;
   });
   vm.CartService = CartService;
   vm.CartService.resetCart();
   vm.CartService.state = 'ventas';
   vm.parameterServices.getParamsFilterByParent('', vm.parameterServices.paramEnum.headers.tipo_sales_pago).then(function(data){
     vm.tipoPagoList = data;
   });

   function init(){
    //resetProductFilter();
    vm.customerServices.scrollMore();

    vm.product = {};
    vm.product.descuento = 0;
    vm.product.qt = 1;
    vm.product.efectivo = 0;
    vm.product.tarjeta = 0;
    vm.product.cheque = 0;
    vm.product.transferencia = 0;
    vm.product.vales = 0;
    vm.product.total = 0;
    vm.product.itbs = 0;
    vm.product.pagado = 0;
    vm.product.change = 0;
    vm.product.subtotal = 0;
    vm.product.discount = 0;
    vm.salesPedingList = [];
    vm.productServices.isPOS = null;
  }
  init();

  //Filtra por categoria y anade la categoria actual
 //Created By: Ronny Morel
 vm.getCategories = function(category){
    category = !category ? 'Categoria' : category;
    vm.selectedCategory = category;
    vm.categorieList = [];
    resetProductCounter();
    var param = [];
    vm.parameterServices.categoryTree(category).then(function(){
      vm.categorieList =  vm.parameterServices.category.ancestors;
      vm.categorieList.push(vm.parameterServices.category._id);
      _.remove(vm.categorieList, function(n) {
       return n  === 'Categoria';
     });
      if(vm.parameterServices.children.length > 0){
        _.forEach(vm.parameterServices.children, function(i){
          param.push(i._id);
        });
      }
      vm.productServices.category = category === 'Categoria' ? null: category;
      // vm.parameterServices.category._id;
      vm.productServices.loadScrollproducts();
    }, function(error){
      alertify.alert('Ha ocurrido un error en el sistema!');
    });
  };
  //vm.getCategoryProducts
  vm.getCategoryProducts = function(value){
   //resetProductCounter();
   vm.selectedCategory = _.isObject(value) ? value._id : value;
   vm.getCategories(vm.selectedCategory);
  //vm.parameterServices.categoryTree(value._id ? value._id : value);
   vm.productServices.category = vm.selectedCategory;
   //vm.productServices.loadScrollproducts();
 };


 vm.showCreateCustomer = function(){

 };

  //Search the product
 vm.getProductFilter = function(param){
    var defer = $q.defer();
    var parm = {
      bardCode: param,
      sucursalId: vm.cajaturnoInfo.sucursalId,
      isPOS: true
    };
    vm.productServices.getProductFilter(parm)
    .then(function(data){
      defer.resolve(data);
    });
    return defer.promise;
  };

vm.payOrder = function(value, type){
 resetPayValue(type);
 vm.pay = value;
 vm.product.tipoPago = type;
 if(vm.product.formaPago !== 'credito'){
  if(value > 0){
    if(value >= vm.product.total){
      vm.product.change = vm.CartService.getChange(value);
      vm.product.pagado = value;
    }else{
      vm.product.pagado = 0;
      vm.product.change = 0;
    }
  }else{
    vm.product.pagado = 0;
    vm.product.change = 0;
    vm.pay = 0;
  }
}else{
  vm.product.credito = getCredito();
}
};

function resetPayValue(type){
  vm.product.efectivo = type === vm.parameterServices.paramEnum.details.tipo_sales_pago_efectivo ? vm.product.efectivo : 0;
  vm.product.cheque = type === vm.parameterServices.paramEnum.details.tipo_sales_pago_cheque ? vm.product.cheque : 0;
  vm.product.tarjeta = type === vm.parameterServices.paramEnum.details.tipo_sales_pago_tarjeta ? vm.product.tarjeta : 0;
  vm.product.vales = type === vm.parameterServices.paramEnum.details.tipo_sales_pago_vales ? vm.product.vales : 0;
  vm.product.tran = type === vm.parameterServices.paramEnum.details.tipo_sales_pago_tran ? vm.product.tranferencia : 0;
}

// vm.productList = [{
//  precios: {uno: {pVenta : 200}},
//  name: 'test'
// }];

//Action
//When a product is selected from the list
vm.selectedItem = function(product){

  // _.forEach(vm.productList, function (i) {
  //    i.name = product.name;
  //    vm.p = i;
  //    console.log(i);
  // });
 var search = {};
     search.bardCode = product.bardCode;
     search.sucursalId = product.sucursalId;

  vm.productServices.getProductFilter(search).then(function(data){
     var newProduct = data[0];
     vm.CartService.addToCart(newProduct, vm.product.qt).then(function(result){
      vm.salesCart = [];
      vm.salesServices.selectedProduct = product;
      vm.cartList = vm.CartService.getCartItems();
      resetCartPrice(vm.cartList);
      vm.product.qt = 1;
    });
  });

};

vm.setPageMode = function(status){
  var cart = vm.CartService.getCartItems();
  if(cart.length > 0){
    vm.product.formaPago = status;
  }
};

vm.setCredit = function(){
var cart = vm.CartService.getCartItems();
 if(cart.length > 0){
    vm.product.tipoPago = vm.tipoPagoList[0]._id;
    vm.pay = 0;
 // vm.product.tipoPago = ;
 vm.product.formaPago = 'credito';
 vm.product.cantPagos = 1;
 vm.product.rango = 'week';
 vm.product.interes = 10;
 vm.product.interesAmount = getInteresAmount();
 vm.product.credito = getCredito();
 vm.totalPagado =  vm.product.total + getInteresAmount();
 vm.setDatePay();
}
};

function getInteresAmount(){
  return (Number(vm.product.total) * Number(vm.product.interes ? vm.product.interes : 0)) / 100;
}

function getCredito(){
  var credit = 0;
  if(Number(vm.pay) >= Number(vm.product.total) ){
    return credit;
  }else{
   credit = (Number(vm.product.total) - vm.pay) + getInteresAmount();
 }
 return credit;
}

vm.setDatePay = function(){
  moment.locale('es');
  vm.product.rangoList = [];
  if(vm.product.rango === 'Q'){
    var pagosDetails =(Number(vm.product.credito) + Number(vm.product.interesAmount)) / Number(vm.product.cantPagos);
    var quincena = 15;
    for(var i = 1 ; i <= vm.product.cantPagos ; i++){
      vm.product.rangoList.push({numero: i, date: moment().add(quincena, 'days').format('DD/MM/YYYY'), day: moment().add(quincena, 'days').format('dddd', 'es'), cantidad: pagosDetails});
      quincena += quincena;
    }
  }else{
    var pagosDetails = (Number(vm.product.credito) + Number(vm.product.interesAmount)) / Number(vm.product.cantPagos);
    for(var i = 1 ; i <= vm.product.cantPagos ; i++){
      vm.product.rangoList.push({numero: i, date: moment().add(i, vm.product.rango).format('DD/MM/YYYY'), day: moment().add(i, vm.product.rango).format('dddd', 'es'), cantidad: pagosDetails});
    }
  };
};

vm.interesChange = function(){
  vm.product.interesAmount = getInteresAmount();
  vm.setDatePay();
  vm.product.credito = getCredito();
  vm.totalPagado =  vm.product.total + getInteresAmount();
};
//var width = window.innerWidth;

vm.saveOrder = function(order){
  vm.product.sucursalId = vm.cajaturnoInfo.sucursalId;
  vm.product.cart = vm.CartService.getCartItems();
  vm.product.fecha_venta = moment().format();
  vm.product.documentType = 'Ticket';
  vm.product.customer = vm.salesServices.selectedCustomer ? vm.salesServices.selectedCustomer : null;
  vm.product.caja = vm.cajaturnoInfo.caja;
  vm.product.cajaturno = vm.cajaturnoInfo._id;
  vm.product.credito = vm.product.formaPago === 'credito' ? vm.product.credito : null;
  vm.product.rango = vm.product.formaPago === 'credito' ? vm.product.rango : null;
  vm.product.interes = vm.product.formaPago === 'credito' ? vm.product.interes : null;
  vm.product.status = order === 'hold' ? vm.parameterServices.paramEnum.details.sales_status_espera : null;
  vm.product.isPending = vm.product.formaPago === 'credito' ? true : false;
  vm.product.interesAmount = vm.product.formaPago === 'credito' ? vm.product.interesAmount : null;
  vm.salesServices.printMode = true;
  vm.ticketDate = moment().format('DD/MM/YYYY');
  vm.ticketTime = moment().format("hh: mm A");
  vm.salesServices.isSaving = true;

  vm.printReport();
  if(!vm.salesServices.selectedSale){
    vm.salesServices.create(vm.product).then(function(data){
     if(order !== 'hold'){
      saveProces(data);
      vm.salesServices.isSaving = false;
    }
  });
  }else{
    vm.product.status = order === 'hold' ? vm.parameterServices.paramEnum.details.sales_status_espera : null;
    vm.product._id = vm.salesServices.selectedSale._id;
    vm.salesServices.update(vm.product).then(function(data){
      saveProces(data);
      vm.salesServices.selectedSale = null;
      vm.salesServices.isSaving = false;
    });
  // console.log(order);
  // console.log(vm.product.rangoList);
}
};

function saveProces(data){
  vm.product.ticketNumber = data.salesId;
  if(vm.product.formaPago === 'credito'){
    angular.forEach(vm.product.rangoList, function(item){
      item.order  = data._id;
      vm.creditServices.create(item);
    });
    if(vm.pay > 0){
      var movimiento = {
       customer : vm.product.customer,
       sales : data._id,
       caja: vm.product.caja,
       cajaturno : vm.product.cajaturno,
       tipoMovimiento: vm.parameterServices.paramEnum.details.tipo_movimiento_ac,
       tipoPago: vm.product.tipoPago,
       montoTotal: vm.pay,
     };
     vm.movimientoServices.create(movimiento).then(function(){
     });
   }
 }
     // vm.printReport();
vm.inventoryServices.getMaxInventory(vm.cajaturnoInfo.sucursalId)
     .then(function(inventoryData){
      if(inventoryData.length > 0){
        vm.inventoryServices.invOutPutField(vm.product.cart, inventoryData[0]).then(function(inventory){
         vm.productServices.decremetProductStuck(vm.product.cart).then(function(){
         });
       });
      }
    });
   }

   vm.setSelectedProduct = function(product){
    vm.salesServices.selectedProduct = product;
  };

  vm.resetCustomer = function(){
    vm.salesServices.selectedCustomer = null;
  };

  vm.printRecive = function(){
    vm.printReport();
  };

 vm.setHold = function(){
  var cart = vm.CartService.getCartItems();
   if(cart.length > 0){
    //if(vm.productServices.product.listproductPromotion.length > 0 && vm.salesPedingList.length <= 5 && !vm.salesServices.selectedSale){
     vm.saveOrder('hold');
     vm.nexOrder();
   }else{
     alertify.error('No se puede poner orden en espera');
   }
 };


 vm.setAccionValue = function(value){
  vm.product.qt = vm.product.qt + '' + value;
};

function resetProductCounter(){
 vm.percent = 0;
 vm.priceChangeAmount = 0;
 vm.productServices.hasMore = true;
 vm.productServices.isLoading = false;
 vm.productServices.page = 1;
 vm.productServices.productList = [];
}

//After click for the next order
vm.nexOrder = function(){
 vm.clearCart();
 vm.salesServices.printMode = false;
 vm.resetCustomer();
 init();
};

//Button cancelar order
vm.cancelOrder = function(){
  vm.product.formaPago = null;
  vm.product.change = 0;
  vm.product.pagado = 0;
  vm.product.tarjeta = 0;
  vm.product.vales = 0;
  vm.product.tranferencia = 0;
  vm.product.cheque = 0;
  vm.product.efectivo = 0;
  vm.pay = 0;
};

vm.discountQuantity = function(){
  if(vm.salesServices.selectedProduct){
  vm.CartService.discountQuantity(vm.salesServices.selectedProduct, vm.product.qt ? vm.product.qt : 1).then(function(){
    var cart = vm.CartService.getCartItems();
    vm.product.qt = 1;
    resetCartPrice(cart);
  });
 }
};

vm.removeItem = function(item){
 vm.CartService.removeFromCart(item).then(function(){
  var cart = vm.CartService.getCart();
  vm.cart = cart.items;
  //vm.productServices.product.listproductPromotion = cart.items;
});
};

vm.saveField = function(index, product) {
  if(vm.editMode){
   vm.CartService.updateItemQuantityByIndex(index, vm.product.Editvalue).then(function(data){
    resetCartPrice();
  });
 }
};

vm.changePrice = function(price){
  var cart = vm.CartService.getCartItems();
  //if(vm.productServices.product.listproductPromotion.length > 0){
  if(cart.length > 0){
    vm.CartService.getItemIndex(vm.salesServices.selectedProduct).then(function(index){
      vm.CartService.updateItemDiscount(index, vm.percent !== 0 ? vm.percent : '');
      vm.CartService.updateItemPrice(index, price).then(function(){
        // var cart = vm.CartService.getCart();
        //vm.productServices.product.listproductPromotion = cart.items;
        vm.product.qt = 1;
        resetCartPrice(cart);
      });
    });
  }
};

vm.priceChange = function(priceAmount){
  vm.percent = vm.CartService.percentDiscount(vm.CartService.getDiscount(priceAmount, vm.salesServices.selectedProduct.precios.uno.pVenta), vm.salesServices.selectedProduct.precios.uno.pVenta);
};

vm.changeSelected = function(newPrice){
   vm.priceChange(newPrice.p_ventaNeto);
   vm.saveChangePrice(newPrice.pVenta);
};

//vm.priceChange

vm.percentChange = function(){
  vm.priceChangeAmount = vm.productServices.amountRemoveTax(vm.salesServices.selectedProduct.precios.uno.pVenta, vm.productServices.getTaxAmount(vm.salesServices.selectedProduct.precios.uno.pVenta, vm.percent));
};

vm.setNewPrice = function(price){
  console.log(price);
};

vm.saveChangePrice = function(newPrice){
  if(newPrice) {
     vm.changePrice(newPrice);
   }
   vm.cancelPriceChange();
 };

vm.openSalesList = function(){
 vm.salesServices.getSales({cajaturno: vm.cajaturnoInfo._id}).then(function(pedingOrder){
  vm.salesPedingList = pedingOrder;
});
 salesPopUp();
};

function resetCartPrice(data){
  vm.product.discount =   vm.CartService.getTotalDiscount(data);
  vm.product.subtotal = vm.CartService.getSubTotal(data);
  vm.product.itbs = vm.CartService.getTotalTax();
  vm.product.total = vm.CartService.getTotalCart();
  vm.product.Editvalue = null;
}

vm.saveFieldPrices = function(index, product){
 if(vm.editModePrices){
  vm.CartService.updateItemCost(index, vm.product.EditvaluePrices).then(function(data){
    resetCartPrice(data);
    // vm.product.subtotal = vm.CartService.getSubTotal(data.items);
    // vm.product.total = vm.CartService.getTotalCart();
    // vm.product.itbs = vm.CartService.getTotalTax();
    // vm.product.EditvaluePrices = null;
  });
}
};

vm.clearCart = function(){
  vm.CartService.resetCart().then(function(data){
    //vm.productServices.product.listproductPromotion = [];
     vm.cartList = null;
     resetCartPrice(data.items);
    // vm.product.sudata total = vm.CartService.getSubTotal(data.items);
    // vm.product.total = vm.CartService.getTotalCart();
    // vm.product.itbs = vm.CartService.getTotalTax();
  });
};

vm.showCreateCustomer = function(){
  vm.createCustomerModal = $modal({
   scope: $scope,
   'templateUrl': 'modules/sales/partials/customer-add.html',
   show: true
             // placement: 'center'
    });
};

vm.selectCustomer = function(){
 vm.createModal = $modal({
   scope: $scope,
   'templateUrl': 'modules/sales/partials/customers.tpl.html',
   show: true
             // placement: 'center'
     });
 //resetProductFilter();
};

function resetFilter(){
 vm.customerServices.hasMore = true;
 vm.customerServices.isLoading = false;
 vm.customerServices.page = 1;
 vm.customerServices.customersList = [];
}

vm.pedingSale = function(sales){
  vm.CartService.setCartItems(sales.cart);
  vm.cartList = vm.CartService.getCartItems();
  vm.salesServices.selectedSale = sales;
  vm.product.discount =   vm.CartService.getTotalDiscount(sales.cart);
  vm.product.subtotal = vm.CartService.getSubTotal(sales.cart);
  vm.product.total = vm.CartService.getTotalCart();
  vm.product.itbs = vm.CartService.getTotalTax();
  vm.salesServices.selectedCustomer = sales.customer;
  //vm.productServices.product.listproductPromotion = sales.cart;
  vm.createModalSales.hide();
};

vm.getHold = function(){
 var val = {
  status : vm.parameterServices.paramEnum.details.sales_status_espera,
  cajaturno : vm.cajaturnoInfo._id
};
vm.salesServices.getSales(val).then(function(pedingOrder){
  vm.salesPedingList = pedingOrder;
});
salesPopUp();
};

function salesPopUp(){
 vm.createModalSales = $modal({
   scope: $scope,
   'templateUrl': 'modules/sales/partials/sales-details.html',
   show: true
 });
}

//Open la ventana de comprovante
vm.setComprovante = function(){
 var param = {
  sucursalId: vm.productServices.sucursalSearch,
  noNcf: vm.comprovante
};
vm.ncfServices.getNcfFilter(param).then(function(data){
  if(data.length > 0){
    vm.salesServices.selectedNcf = data[0];
    if(Number(vm.salesServices.selectedNcf.secInicial) < Number(vm.salesServices.selectedNcf.secFinal)){
     if(vm.comprovante !== '02'){
       vm.createModalComprovante = $modal({
        scope: $scope,
        'templateUrl': 'modules/sales/partials/comprovante.html',
        show: true,
        backdrop: 'static'
      });
     }
   }else{
    vm.comprovante = '';
    alertify.alert('El comprovante no tiene secuencia disponible').setHeader('<i class="fa fa-warning"></i> ');
  }

}else{
 vm.comprovante = '';
 alertify.alert('El comprovante no tiene secuencia disponible').setHeader('<i class="fa fa-warning"></i> ');
}
}, function(err){
  alertify.alert('Se ha producido un error en el sistema').setHeader('<i class="fa fa-warning"></i> ');;
});
};

//Cancelar ncf
vm.cancelNcf = function(){
  vm.comprovante = '';
  vm.createModalComprovante.hide();
};

//Set ncf
vm.saveNcf = function($isValid, ncf){
  if(!$isValid){
    if(vm.ncfServices.validateNCF(vm.rnc)){
      vm.ncfSerie = vm.salesServices.selectedNcf.serie + vm.salesServices.selectedNcf.dn + vm.salesServices.selectedNcf.pe + vm.salesServices.selectedNcf.ai + vm.salesServices.selectedNcf.code;
      vm.cancelNcf();
    }else{
     alertify.alert('RNC/Cédula invalida').setHeader('<i class="fa fa-warning"></i> ');
   }
 }
};

//reset NCF after selected
vm.resetNCF = function(){
   vm.ncfSerie = null;
   vm.salesServices.selectedNcf = null;
};

//Open price list
vm.openPriceModal = function(){
 if(vm.salesServices.selectedProduct !== null){
  vm.percent = 0;
  vm.priceChangeAmount = 0;
  vm.priceModal = $modal({
        scope: $scope,
        'templateUrl': 'modules/sales/partials/product-price.html',
        show: true,
        backdrop: 'static'
   });
 }
};

vm.cancelPriceChange = function(){
   vm.priceModal.hide();
   vm.salesServices.selectedProduct = null;
};


vm.removeHoldSale = function(sale){
 vm.salesServices.delete(sale);
 vm.salesServices.selectedSale = null;
 vm.nexOrder();
};

vm.loadMore = function(){
  vm.customerServices.scrollMore();
};

vm.loadMoreProduct = function() {
  vm.productServices.scrollMore();
};

vm.setClient = function(client){
  vm.salesServices.selectedCustomer = client;
  vm.CartService.setClient(client);
  vm.createModal.hide();
};

vm.printReport = function(){
  vm.isPrinting = true;
  // var defer = $q.defer();
  $timeout(function(){
   var printSection = document.getElementById('printSection');
   //var ticketContainer = document.getElementById('ticketContainer');
   function printElement(elem) {
    printSection.innerHTML = '';
    //console.log(elem);
    printSection.appendChild(elem);
    //window.print();
   }
  if (!printSection) {
    printSection = document.createElement('div');
    printSection.id = 'printSection';
    document.body.appendChild(printSection);
  }
                //var target =  angular.element(document.querySelector('#printThisElement'));
  var elemToPrint = document.getElementById("printThisElement");
  window.print();
         //
         console.log(elemToPrint);
                // if (elemToPrint) {
                //   printElement(elemToPrint);
                // }
    }, 2000);
  //return defer.promise;
};
}
})();
