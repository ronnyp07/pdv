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
  'cartService',
  '$q',
  'SalesRestServices',
  '$timeout',
  '$document',
  'SucursalsService',
  'CustomerRestServices',
  '$modal',
  'CreditpaysRestServices',
  'MovimientoRestServices',
  '$rootScope'];
  function SalesController (
    $scope,
    $state,
    Authentication,
    sale,
    ParameterRestServices,
    ProductRestServices,
    InventoryRestServices,
    cartService,
    $q,
    SalesRestServices,
    $timeout,
    $document,
    SucursalsService,
    CustomerRestServices,
    $modal,
    CreditpaysRestServices,
    MovimientoRestServices,
    $rootScope) {
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
    vm.creditServices = CreditpaysRestServices;
    vm.movimientoServices = MovimientoRestServices;
    vm.setCategoryValue = function(value){
     vm.selectedCategory = value;
   };
   vm.parameterServices.categoryTree('Categoria');
   vm.parameterServices.getParamsFilterByParent('', vm.parameterServices.paramEnum.headers.tipo_factura).then(function(data){
     vm.tipoFacturaList = data;
   });
   vm.productServices.product.listproductPromotion = [];
   vm.cartService = cartService;
   vm.cartService.self.state = 'ventas';
   vm.parameterServices.getParamsFilterByParent('', vm.parameterServices.paramEnum.headers.tipo_sales_pago).then(function(data){
     vm.tipoPagoList = data;
   });

   function init(){
    resetProductFilter();
    vm.customerServices.scrollMore();

    vm.product = {};
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
    vm.salesPedingList = [];
  }
  init();

   //Filtra por categoria y anade la categoria actual
   //Created By: Ronny Morel
  vm.getCategories = function(category){
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
      vm.productServices.category = param.length > 0 ? param: vm.parameterServices.category._id;
      // vm.parameterServices.category._id;
      vm.productServices.loadScrollproducts();
    }, function(error){
      alertify.alert('Ha ocurrido un error en el sistema!');
    });
  };
  //vm.getCategoryProducts
  vm.getCategoryProducts = function(value){
   //resetProductCounter();
   vm.selectedCategory = value._id ? value._id : value;
   vm.getCategories(value._id ? value._id : value);
  //vm.parameterServices.categoryTree(value._id ? value._id : value);
   vm.productServices.category = value._id;
   //vm.productServices.loadScrollproducts();
  };

  //Search the product
  vm.getProductFilter = function(param){
    var defer = $q.defer();
    var parm = {
      bardCode: param,
      sucursalId: vm.cajaturnoInfo.sucursalId
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

vm.payOrder = function(value, type){
 resetPayValue(type);
 vm.pay = value;
 vm.product.tipoPago = type;
 if(vm.product.formaPago !== 'credito'){
  if(value > 0){
    if(value >= vm.product.total){
      vm.product.change = vm.cartService.getChange(value);
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

vm.selectedItem = function(product){
  vm.cartService.addToCart(product, vm.product.qt).then(function(data){
    vm.productServices.product.listproductPromotion = data.items;
    vm.salesCart = [];
    //  var precios = {
    //     uno: {
    //       pVenta : 130,
    //       m_utilidad: 30,
    //       p_ventaNeto: 130,
    //       p_porMayor: 7
    //     },
    //     dos: {
    //       pVenta : 150,
    //       m_utilidad: 50,
    //       p_ventaNeto: 150,
    //       p_porMayor: 5
    //     },
    //     tres: {
    //       pVenta : 140,
    //       m_utilidad: 40,
    //       p_ventaNeto: 140,
    //       p_porMayor: 10
    //     },
    //     cuatro: {
    //       pVenta : 130,
    //       m_utilidad: 30,
    //       p_ventaNeto: 0,
    //       p_porMayor: 130
    //     }
    // };
    vm.salesServices.selectedProduct = product;
    vm.product.subtotal = vm.cartService.getSubTotal(data.items);
    vm.product.total = vm.cartService.getTotalCart();
    vm.product.itbs = vm.cartService.getTotalTax();
    vm.product.qt = 1;
  });
};

vm.setPageMode = function(status){
 if(vm.productServices.product.listproductPromotion.length > 0){
  vm.product.formaPago = status;
}
};

vm.setCredit = function(){
  if(vm.productServices.product.listproductPromotion.length > 0){
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
  // if(vm.product.cantPagos === 0 || vm.product.cantPagos === null){
  //   vm.product.cantPagos = 1;
  // }
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
var width = window.innerWidth;
console.log(width);
// || document.documentElement.clientWidth
// || document.body.clientWidth;

vm.saveOrder = function(order){
  vm.product.sucursalId = vm.cajaturnoInfo.sucursalId;
  vm.product.cart = vm.productServices.product.listproductPromotion;
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
    vm.product.status = null;
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
    if(vm.productServices.product.listproductPromotion.length > 0 && vm.salesPedingList.length <= 5 && !vm.salesServices.selectedSale){
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
 vm.productServices.hasMore = true;
 vm.productServices.isLoading = false;
 vm.productServices.page = 1;
 vm.productServices.productList = [];
}

vm.nexOrder = function(){
 vm.clearCart();
 vm.salesServices.printMode = false;
 vm.resetCustomer();
 init();
};

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
  vm.cartService.discountQuantity(vm.salesServices.selectedProduct, vm.product.qt ? vm.product.qt : 1).then(function(){
    var cart = vm.cartService.getCart();
    vm.productServices.product.listproductPromotion = cart.items;
    vm.product.qt = 1;
    resetCartPrice(cart);
  });
};

vm.removeItem = function(item){
 vm.cartService.removeFromCart(item).then(function(){
  var cart = vm.cartService.getCart();
  vm.productServices.product.listproductPromotion = cart.items;
});
};

vm.saveField = function(index, product) {
  if(vm.editMode){
   vm.cartService.updateItemQuantityByIndex(index, vm.product.Editvalue).then(function(data){
    resetCartPrice();
  });
 }
};

vm.changePrice = function(){
  vm.focusinControl.show();
  if(vm.productServices.product.listproductPromotion.length > 0){
    vm.cartService.getItemIndex(vm.salesServices.selectedProduct).then(function(index){
      vm.cartService.updateItemPrice(index, vm.product.qt).then(function(){
        var cart = vm.cartService.getCart();
        vm.productServices.product.listproductPromotion = cart.items;
        vm.product.qt = 1;
        resetCartPrice(cart);
      });
    });
  }
};

vm.openSalesList = function(){
 vm.salesServices.getSales({cajaturno: vm.cajaturnoInfo._id}).then(function(pedingOrder){
  vm.salesPedingList = pedingOrder;
});
 salesPopUp();
};

function resetCartPrice(data){
  vm.product.subtotal = vm.cartService.getSubTotal(data);
  vm.product.total = vm.cartService.getTotalCart();
  vm.product.itbs = vm.cartService.getTotalTax();
  vm.product.Editvalue = null;
}

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

vm.selectCustomer = function(){
 vm.createModal = $modal({
   scope: $scope,
   'templateUrl': 'modules/sales/partials/customers.tpl.html',
   show: true
             // placement: 'center'
           });
 resetProductFilter();
};

function resetProductFilter(){
 vm.customerServices.hasMore = true;
 vm.customerServices.isLoading = false;
 vm.customerServices.page = 1;
 vm.customerServices.customersList = [];
}

vm.pedingSale = function(sales){
  vm.cartService.setCartItems(sales.cart);
  vm.salesServices.selectedSale = sales;
  vm.product.subtotal = vm.cartService.getSubTotal(sales.cart);
  vm.product.total = vm.cartService.getTotalCart();
  vm.product.itbs = vm.cartService.getTotalTax();
  vm.salesServices.selectedCustomer = sales.customer;
  vm.productServices.product.listproductPromotion = sales.cart;
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
  vm.cartService.setClient(client);
  vm.createModal.hide();
};

vm.printReport = function(){
  vm.isPrinting = true;
  var defer = $q.defer();
  $timeout(function(){
   var printSection = document.getElementById('printSection');
   var ticketContainer = document.getElementById('ticketContainer');
   function printElement(elem) {
    printSection.innerHTML = '';
    printSection.appendChild(elem);
    window.print();
  }
  if (!printSection) {
    printSection = document.createElement('div');
    printSection.id = 'printSection';
    document.body.appendChild(printSection);
  }
                //var target =  angular.element(document.querySelector('#printThisElement'));
                var elemToPrint = document.getElementById("printThisElement");
                if (elemToPrint) {
                  printElement(elemToPrint);
                }
              }, 2000);
  return defer.promise;
};
}
})();
