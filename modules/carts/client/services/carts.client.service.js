//Carts service used to communicate Carts REST endpoints
(function () {
  'use strict';

  var cartModule = angular .module('carts');
  cartModule.factory('CartsService', CartsService);

  CartsService.$inject = ['$resource'];

  function CartsService($resource) {
    return $resource('api/carts/:cartId', {
      cartId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  cartModule.service('cartService', function ($resource, $rootScope, $q, PartnersService, ProductRestServices) {
    var cart = {
      client: {_id: 'default', name: 'Consumidor Final', address: ''},
      items:[],
      subtotal: 0,
      tax: 0,
      taxList: []
    }, order, self = {state: 'compra', client: null};

    PartnersService.get(function(data){
      if(data){
        //cart.tax = Number(data.results[0].imp_Porcentaje) ? Number(data.results[0].imp_Porcentaje): 0;
        cart.taxList = data.results[0].impuestosList;
       }
    });

    return {
      addToCart: addToCart,
      removeFromCart: removeFromCart,
      getCart: getCart,
      changeTax: changeTax,
      updateItemQuantity: updateItemQuantity,
      updateItemQuantityByIndex : updateItemQuantityByIndex,
      setClient: setClient,
      addDiscount: addDiscount,
      resetDiscounts: resetDiscounts,
      applyCoupon: applyCoupon,
      applyDiscount: applyDiscount,
      getDiscountsForCart: getDiscountsForCart,
      resetCart: resetCart,
      resetClient:resetClient,
      getSubTotal: getSubTotal,
      getItemIndex: getItemIndex,
      getClient: getClient,
      setCartItems: setCartItems,
      getTotalCart: getTotalCart,
      getTotalTax: getTotalTax,
      updateItemCost: updateItemCost,
      discountQuantity: discountQuantity,
      getOrder: getOrder,
      setOrder: setOrder,
      setCart: setCart,
      getChange: getChange,
      orderBy: orderBy,
      self,
      updateItemPrice: updateItemPrice
    };

    function addToCart(item, qt){
      var defer = $q.defer();
      if(!cart.items){
        cart.items = [];
      }

      console.log(item);
      var itemIndex = _.findIndex(cart.items, function(o) { return o._id === item._id; });
      var priceGet = null;
      //

      if(itemIndex >=0){
       cart.items[itemIndex].quantity = Number(qt) ? cart.items[itemIndex].quantity + Number(qt) : 1;
       priceGet = orderBy(item, cart.items[itemIndex].quantity);
       cart.items[itemIndex].price = priceGet.p_ventaNeto;
       cart.items[itemIndex].total = Number(cart.items[itemIndex].quantity) * Number(self.state === 'compra' ? cart.items[itemIndex].cost : priceGet.p_ventaNeto);
       getTotalTax();
     }else{
       item.quantity = qt;
       priceGet = orderBy(item, item.quantity);
       item.price = priceGet.p_ventaNeto;
       item.total = Number(item.quantity) * Number(self.state === 'compra' ? item.cost : priceGet.p_ventaNeto);
       cart.items.push(item);
       getTotalTax();
     }

     defer.resolve(cart);

      // var r = $resource('api/products');
      // var promise = r.get({_id: id}, function(item) {
      //   cart.items.push(item);
      //   updateItemQuantity(id, 1);
      //   // notify that we added an item to the cart
      //   $rootScope.$broadcast('_new_item_added_', item);
      // });

      return defer.promise; // return the promise for further handling
    }

    function removeFromCart(index){
      var defer = $q.defer();
      // cart.items = cart.items.filter(function(e){
      //   return e._id !== id;
      // });
      cart.items.splice(index, 1);
      defer.resolve();
      return defer.promise;
    }

    function discountQuantity(item, q){
      var index = _.findIndex(cart.items, function(o) { return o._id === item._id; });
      var defer = $q.defer();
      if(q >= cart.items[index].quantity){
        removeFromCart(index);
      }else{
        cart.items[index].quantity = Number(cart.items[index].quantity) - Number(q);
      }
      defer.resolve();
      return defer.promise;
    }

    /* get the cart from somewhere */
    function getCart(){
      return cart;
    }

    function setCart(_cart_){
      cart = _cart_;
    }

    function setCartItems(_items_){
      cart.items = _items_;
    }

    function setState(state){
      state = state;
    }

    function setOrder(_order_){
      order = _order_;
    }

    function getOrder(){
      return order;
    }
    function getTax(){
      return cart.tax;
    }

    function changeTax (tax) {
      cart.tax = tax;
    }

    function updateItemQuantity (id, quantity) {
      var itemSaved, quantityUpdate;
      _.forEach(cart.items, function (i) {
        if (id === i._id) {
          quantityUpdate = quantity ? quantity : i.quantity + 1;
          i.quantity = quantityUpdate;
          itemSaved = i;
        }
      });
      return itemSaved;
    }

   function updateItemQuantityByIndex(index, quantity){
     var defer = $q.defer();
     cart.items[index].quantity = Number(quantity);
     cart.items[index].total = Number(cart.items[index].quantity) *  Number(self.state === 'compra' ? cart.items[index].cost : cart.items[index].price);
     defer.resolve(cart.items);
     return defer.promise;
   }

   function getItemIndex(item){
     var defer = $q.defer();
     var itemIndex = _.findIndex(cart.items, function(o) { return o._id === item._id; });
     defer.resolve(itemIndex);
     return defer.promise;
   }


function orderBy(param, qt){
    var result = _.orderBy(param.precios, ['p_porMayor'], ['desc']);
    var price = {};
    var keepGoing = true;
        angular.forEach(result, function(o){
        if(keepGoing){
          if(o.p_porMayor > 0 &&  Number(qt) >= o.p_porMayor){
               price = o;
               keepGoing = false;
           }else{
            price = param.precios.uno;
           }
         }
        });

        return price;
     // _.forEach(result, function(o){
     //       if(o.p_porMayor > 0 &&  Number(qt) >= o.p_porMayor){
     //           price = o;
     //           return;
     //       }
     //   });
   }

   function updateItemPrice(index, price){
     var defer = $q.defer();
     cart.items[index].price = Number(price);
     cart.items[index].total = Number(cart.items[index].quantity) * Number(cart.items[index].price);
     defer.resolve(cart.items);
     return defer.promise;
   }

   function updateItemCost(index, cost){
     var defer = $q.defer();
     cart.items[index].cost = Number(cost);
     cart.items[index].total = Number(cart.items[index].quantity) * Number(cart.items[index].cost);
     defer.resolve(cart.items);
     return defer.promise;
   }

   function setClient (client) {
    cart.client = client;
  }

  function getClient(){
    return cart.client;
  }

  function addDiscount (discount) {
    cart.discounts = cart.discounts || [];
    cart.discounts.push(discount);
  }

  function resetDiscounts(){
    cart.discounts = [];
  }

  function getDiscountsForCart(filter){
    var r = $resource('api/discounts/:filter', {filter:'@filter'});
    var promise = r.save({cart: cart, filter: filter}, function(data){
      if(filter === 'byclient'){
        cart.discounts = data.discounts;
      }else{
        return data;
      }
    });

    return promise;
  }
  function applyCoupon (idCoupon) {
    cart.pendingCoupons = cart.pendingCoupons || [];
    cart.pendingCoupons.push(idCoupon);
    getDiscountsForCart('byclient');
  }

  function applyDiscount (idDiscount) {
    cart.pendingDiscounts = cart.pendingDiscounts || [];
    cart.pendingDiscounts.push(idDiscount);
    getDiscountsForCart('byclient');
  }

  function resetCart(){
   var defer = $q.defer();
   var client = {_id: 'default', name: 'Consumidor Final', address: ''};
   cart.items = [];
   cart.discounts = [];
   setClient(client);
   defer.resolve(cart);
   return defer.promise;
 }

 function resetClient(){
  var client = {_id: 'default', name: 'Consumidor Final', address: ''};
  setClient(client);
}

function getSubTotal (items) {
  var subtotal = 0;
  if (items) {
    _.forEach(items, function (item) {
      var itemValue = self.state === 'compra' ? item.cost : item.total;
      //subtotal = subtotal + (Number(item.quantity) * Number(itemValue));
      subtotal += ProductRestServices.amountAfterTax(itemValue, ProductRestServices.getTaxAmount(itemValue, ProductRestServices.getTax(item.taxesFlag, cart.taxList)));
    });
  }
  return subtotal;
}

function getChange(value){
 var total = getTotalCart();
 return value - total;
}

function getTotalCart() {
  var totalDiscounts = getSubTotal(cart.discounts) || 0,
  subtotal = getSubTotal(cart.items),
  totalTax = getTotalTax(cart.tax);
  return (subtotal + totalTax) - totalDiscounts;
}

function getTotalTax() {
  var tax = 0;
  _.forEach(cart.items, function (item) {
     tax += ProductRestServices.getTaxAmount(item.total, ProductRestServices.getTax(item.taxesFlag, cart.taxList));
      // var itemValue = self.state === 'compra' ? item.cost : item.price;
      // subtotal = subtotal + (Number(item.quantity) * Number(itemValue));
    });
  console.log(tax);
  changeTax(tax);
  return tax;
  //return getSubTotal(cart.items) * (cart.tax/100);
}
});
})();
