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

   cartModule.service('CartService', function ($resource, $rootScope, $q, PartnersService, ProductRestServices) {
    ///self = {state: 'compra', client: null};

    PartnersService.get(function(data){
      if(data){
        //self.cart.tax = Number(data.results[0].imp_Porcentaje) ? Number(data.results[0].imp_Porcentaje): 0;
        self.cart.taxList = data.results[0].impuestosList;
      }
    });

    var self = {
      cart : {
        client: {_id: 'default', name: 'Consumidor Final', address: ''},
        items:[],
        subtotal: 0,
        tax: 0,
        discount: 0,
        taxList: []
      },
      'state': 'compra',
      'order': null,
      'addToCart': function(item, qt){
        var defer = $q.defer();
        if(!self.cart.items){
          self.cart.items = [];
        }
        var tempItem = null;
        var itemIndex = _.findIndex(self.cart.items, function(o) { return o._id === item._id; });
        var priceGet = null;
        if(itemIndex >=0){
         self.cart.items[itemIndex].quantity = Number(qt) ? self.cart.items[itemIndex].quantity + Number(qt) : 1;
         priceGet = self.orderBy(item, self.cart.items[itemIndex].quantity);
         self.cart.items[itemIndex].price = priceGet.p_ventaNeto;
         self.cart.items[itemIndex].total = Number(self.cart.items[itemIndex].quantity) * Number(self.state === 'compra' ? self.cart.items[itemIndex].cost : priceGet.p_ventaNeto);
       //getTotalTax();
     }else{
       tempItem = item;
       //tempItem.quantity = qt;
       //priceGet = orderBy(tempItem, tempItem.quantity);
       //tempItem.price = priceGet.p_ventaNeto;
       //tempItem.total = Number(tempItem.quantity) * Number(self.state === 'compra' ? tempItem.cost : priceGet.p_ventaNeto);
       self.cart.items.push(tempItem);
       var index = _.findIndex(self.cart.items, function(o) { return o._id === item._id; });
       self.cart.items[index].quantity = qt;
       priceGet = self.orderBy(tempItem, tempItem.quantity);
       self.cart.items[index].price = priceGet.p_ventaNeto;
       self.cart.items[index].total = Number(tempItem.quantity) * Number(self.state === 'compra' ? tempItem.cost : priceGet.p_ventaNeto);
       tempItem = null;
       //getTotalTax();
     }

     defer.resolve(self.cart);
      return defer.promise; // return the promise for further handling
    },
    removeFromCart: function(index){
      var defer = $q.defer();
      self.cart.items.splice(index, 1);
      defer.resolve();
      return defer.promise;
    },
    getCart: function(){
      return self.cart;
    },
    changeTax: function(tax) {
      self.cart.tax = tax;
    },
    updateItemQuantity: function(id, quantity) {
      var itemSaved, quantityUpdate;
      _.forEach(self.cart.items, function (i) {
        if (id === i._id) {
          quantityUpdate = quantity ? quantity : i.quantity + 1;
          i.quantity = quantityUpdate;
          itemSaved = i;
        }
      });
      return itemSaved;
    },
    updateItemQuantityByIndex : function(index, quantity){
     var defer = $q.defer();
     self.cart.items[index].quantity = Number(quantity);
     self.cart.items[index].total = Number(self.cart.items[index].quantity) *  Number(self.state === 'compra' ? self.cart.items[index].cost : self.cart.items[index].price);
     defer.resolve(self.cart.items);
     return defer.promise;
   },
   updateItemDiscount : function(index, discount){
     self.cart.items[index].discount = discount;
   },
   setClient: function(client) {
     self.cart.client = client;
   },
   addDiscount: function(discount) {
    self.cart.discounts = self.cart.discounts || [];
    self.cart.discounts.push(discount);
  },
  resetDiscounts: function(){
    self.cart.discounts = [];
  },
  getDiscountsForCart: function(filter){
    var r = $resource('api/discounts/:filter', {filter:'@filter'});
    var promise = r.save({cart: self.cart, filter: filter}, function(data){
      if(filter === 'byclient'){
        self.cart.discounts = data.discounts;
      }else{
        return data;
      }
    });
    return promise;
  },
  // resetCart: resetCart,
  // resetClient:resetClient,
  // getSubTotal: getSubTotal,
  getItemIndex: function(item){
   var defer = $q.defer();
   var itemIndex = _.findIndex(self.cart.items, function(o) { return o._id === item._id; });
   defer.resolve(itemIndex);
   return defer.promise;
 },getCartItems: function (){
  return self.cart.items;
},getClient: function(){
  return self.cart.client;
},setCartItems: function(_items_){
  self.cart.items = _items_;
},
// getTotalCart: getTotalCart,
// getTotalTax: getTotalTax,
// getTotalDiscount: getTotalDiscount,
updateItemCost:  function(index, cost){
 var defer = $q.defer();
 self.cart.items[index].cost = Number(cost);
 self.cart.items[index].total = Number(self.cart.items[index].quantity) * Number(self.cart.items[index].cost);
 defer.resolve(self.cart.items);
 return defer.promise;
},
discountQuantity: function(item, q){
  var priceGet = null;
  var index = _.findIndex(self.cart.items, function(o) { return o._id === item._id; });
  var defer = $q.defer();
  if(q >= self.cart.items[index].quantity){
    self.removeFromCart(index);
  }else{
    priceGet = self.orderBy(item, item.quantity - q);
    self.cart.items[index].price = priceGet.p_ventaNeto;
    self.cart.items[index].quantity = Number(self.cart.items[index].quantity) - Number(q);
  }
  defer.resolve();
  return defer.promise;
},
setOrder: function(_order_){
  self.order = _order_;
},
setCart: function(_cart_){
  self.cart = _cart_;
},
orderBy: function(param, qt){
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
},
applyCoupon: function (idCoupon) {
  self.cart.pendingCoupons = self.cart.pendingCoupons || [];
  self.cart.pendingCoupons.push(idCoupon);
  self.getDiscountsForCart('byclient');
},

applyDiscount: function(idDiscount) {
  self.cart.pendingDiscounts = self.cart.pendingDiscounts || [];
  self.cart.pendingDiscounts.push(idDiscount);
  self.getDiscountsForCart('byclient');
},
resetCart: function(){
 var defer = $q.defer();
 var client = {_id: 'default', name: 'Consumidor Final', address: ''};
 self.cart.items = [];
 self.cart.discounts = [];
 self.setClient(client);
 defer.resolve(self.cart);
 return defer.promise;
},

resetClient: function(){
  var client = {_id: 'default', name: 'Consumidor Final', address: ''};
  self.setClient(client);
},

getSubTotal: function(items) {
  var subtotal = 0;
  if (items) {
    _.forEach(items, function (item) {
      var itemValue = self.state === 'compra' ? item.cost : item.price;
      //console.log(itemValue);
      subtotal = subtotal + (Number(item.quantity) * Number(itemValue));
      //subtotal += ProductRestServices.amountAfterTax(itemValue, ProductRestServices.getTaxAmount(itemValue, ProductRestServices.getTax(item.taxesFlag, self.cart.taxList)));
    });
  }
  return subtotal;
},

getChange: function(value){
 var total = self.getTotalCart();
 return value - total;
},

getTotalCart: function(){
  var totalDiscounts = self.getSubTotal(self.cart.discounts) || 0,
  subtotal = self.getSubTotal(self.cart.items),
  totalTax = self.getTotalTax(self.cart.tax);
  return (subtotal + totalTax) - self.getTotalDiscount();
},

getDiscount: function(newPrice, currentPrice){
 var discount = 0;
 if(currentPrice >= newPrice){
  discount = Number(currentPrice) - Number(newPrice);
}
return discount;
},

percentDiscount: function(discount, price){
 return Number(discount) * 100 / price;
},

getTotalDiscount: function(items) {
  var disc = 0;
  _.forEach(items, function (item) {
    if(item.discount > 0){
      disc += item.discount;
    }
  });
  return disc;
},
getTotalTax: function(){
  var tax = 0;
  _.forEach(self.cart.items, function (item) {
   tax += ProductRestServices.getTaxAmount(item.quantity * item.price, ProductRestServices.getTax(item.taxesFlag, self.cart.taxList));
 });
  self.changeTax(tax);
  return tax;
},
self,
updateItemPrice: function(index, price){
 var defer = $q.defer();
 self.cart.items[index].price = Number(price);
 self.cart.items[index].total = Number(self.cart.items[index].quantity) * Number(self.cart.items[index].price);
 defer.resolve(self.cart.items);
 return defer.promise;
}
};
return self;
});
})();
