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

  cartModule.service('cartService', function ($resource, $rootScope, $q, PartnersService) {


    var cart = {
      client: {_id: 'default', name: 'Consumidor Final', address: ''},
      items:[],
      subtotal: 0,
      tax: 0
    }, order, self = {state: 'compra', client: null};

    PartnersService.get(function(data){
      if(data){
       cart.tax = Number(data.results[0].imp_Porcentaje) ? Number(data.results[0].imp_Porcentaje): 0;
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
      self,
      updateItemPrice: updateItemPrice
    };

    function addToCart(item, qt){
      var defer = $q.defer();
      if(!cart.items){
        cart.items = [];
      }
      var itemIndex = _.findIndex(cart.items, function(o) { return o._id === item._id; });
      //

      if(itemIndex >=0){
       cart.items[itemIndex].quantity = Number(qt) ? cart.items[itemIndex].quantity + Number(qt) : 1;
       cart.items[itemIndex].total = Number(cart.items[itemIndex].quantity) * Number(self.state === 'compra' ? cart.items[itemIndex].cost : cart.items[itemIndex].price);
     }else{
       item.quantity = qt;
       item.total = Number(item.quantity) * Number(self.state === 'compra' ? item.cost : item.price);
       cart.items.push(item);
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
      var itemValue = self.state === 'compra' ? item.cost : item.price;
      subtotal = subtotal + (Number(item.quantity) * Number(itemValue));
    });
  }
  return subtotal;
}
function getChange(value){
 var total = getTotalCart();
 return value - total;
}
vm.product.pagado
function getTotalCart() {
  var totalDiscounts = getSubTotal(cart.discounts) || 0,
  subtotal = getSubTotal(cart.items),
  totalTax = getTotalTax(cart.tax);
  return (subtotal + totalTax) - totalDiscounts;
}

function getTotalTax () {
  return getSubTotal(cart.items) * (cart.tax/100);
}
});
})();
