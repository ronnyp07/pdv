//products service used to communicate products REST endpoints
(function () {
  'use strict';

  var productsModule = angular.module('products');
  productsModule.factory('productsService', productsService);

  productsService.$inject = ['$resource'];

  function productsService($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: { method: 'GET'}
    });
  }

  productsModule.service('ProductRestServices',  ['$q', '$http', '$timeout', 'productsService', '$rootScope', 'Authentication', function($q, $http, $timeout, productsService, $rootScope, Authentication){
    var self ={
     'productList': [],
     'tempAncestors': [],
     'listProductPromotion': [],
     'tempSelectedProduct': null,
     'tempParent': null,
     'authentication': Authentication,
     'prodcutName': '',
     'category': '',
     'isPOS': '',
     'product': {},
    'saveMode': '',
    'hasMore': true,
    'counter': 15,
    'scollCount': 5,
    'selectedProduct': null,
    'page': 1,
    'total': 0,
    'count': 15,
    'ordering': null,
    'sucursalSearch': '',
    'search': {},
    'isSaving': false,
    'isLoading': false,
    'carList': [],

    'loadproducts': function(){
      var defer = $q.defer();
      self.isLoading = true;
      self.params = {
        'page': self.page,
        'search': {sucursalId: self.sucursalSearch,
         name: self.productName,
         category: self.category,
         isPOS: self.isPOS},
         'ordering': self.ordering
       };

       productsService.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.productList = [];
        if(data.results){
          angular.forEach(data.results, function(item){
            self.productList.push(item);
          });
          self.isLoading = false;
          // if(self.count >= self.total){
          //   self.hasMore = false;
          // }
        }
      }, function(error){
        defer.reject();
      });
       return defer.promise;
     },'loadMore': function(page){
      self.count += self.counter;
      self.loadproducts();
    }, loadSucursal : function(){
      var sucursalInfo = Authentication.sucursalCache.get('sucursal');
      self.sucursalSearch = sucursalInfo !=='superUser' ? sucursalInfo.sucursalId._id: null;
    },'loadScrollproducts': function(){
      if(self.hasMore && !self.isLoading){
        self.isLoading = true;
        var params = {
          'page': self.page,
          'search': {sucursalId: self.sucursalSearch,
           name: self.productName,
           category: self.category,
           isPOS: self.isPOS},
           'ordering': self.ordering
         };
        productsService.get(params, function(data){
          self.total = data.total;        //self.count = parseInt(data.options.count);
        if(data){
         angular.forEach(data.results, function(item){
          self.productList.push(item);
        });
       }
       if(self.productList.length >= data.total){
        self.hasMore = false;
      }
      self.isLoading = false;
    });
       }
     },'scrollMore': function(){
      if(self.productList.length <= 0){
        self.page = 1 ;
        self.loadScrollproducts();
      }else{
        if(self.hasMore && !self.isLoading){
          self.page += 1;
          self.scollCount += self.scollCount;
          self.loadScrollproducts();
        }
      }
    }, getPriceNeto : function(){
     self.product.taxcost = self.product.cost;
     self.product.d_cost = self.product.cost / self.product.unidades;
   },
   'getParamsFilter': function(val){
    var data = {
      lastName: val
    };
    var result = [] ;
    var deferred =  $q.defer();

    $http.post('/api/productfilter', data)
    .success(function(response) {
      angular.forEach(response, function(card) {
        result.push(card);
      });
      return deferred.resolve(result);
    })
    .error(function(){
      /* error handling */
    });
    return deferred.promise;
  },getTax : function(activeTax, arrayTax){
    var totalTax = 0;
    _.forIn(activeTax, function(value, key) {
     var impuesto = _.find(arrayTax, { 'imp_Type': key});
     if(value)
     {
      totalTax += impuesto.imp_Porcentaje;
    }

  });
    return totalTax;
 },getTaxAmount: function(amount, tax){
   return Number(amount) * tax / 100;
 },amountAfterTax: function(amount, discauntTax){
   return Number(amount) + discauntTax;
 },amountRemoveTax: function(amount, discauntTax){
   return Number(amount) - discauntTax;
 },'filterProductBySucursal': function(val){
   var data = {
    sucursalId: val.sucursalId,
    categories: val.categories ? JSON.stringify(val.categories) : null
  };

  var result = [],
  deferred =  $q.defer();

  $http.post('/api/getProductBySucursal', data)
  .success(function(response) {
    angular.forEach(response, function(card) {
      result.push(card);
    });
    return deferred.resolve(result);
  })
  .error(function(){
    /* error handling */
  });
  return deferred.promise;

},'incrementProductStuck':function(value){
  var defer = $q.defer();
  angular.forEach(value, function(result){
    productsService.get({productId: result._id}, function(data){
     data.inStock = data.inStock + result.quantity;
     data.$update(function(data){});
   });
  });
  defer.resolve();

  return defer.promise;
},'decremetProductStuck':function(value){
  var defer = $q.defer();
  angular.forEach(value, function(result){
    productsService.get({productId: result._id}, function(data){
     if(data.inStock !== 0){
       data.inStock = Number(data.inStock) - Number(result.quantity);
       data.$update(function(data){});
     }
   });
  });
  defer.resolve();

  return defer.promise;
},'getProductFilter': function(val){
  var data = {
    bardCode: val.bardCode,
    sucursalId: val.sucursalId
  };
  var result = [];
  var deferred =  $q.defer();

  $http.post('/api/productFilter', data)
  .success(function(response) {
    angular.forEach(response, function(card) {
      result.push(card);
    });
    return deferred.resolve(result);
  })
  .error(function(){
    /* error handling */
  });
  return deferred.promise;
},'updateProduct': function(param){
  var defer = $q.defer();
  self.isSaving = true;
  var Product = new productsService(param);
  Product.$update(function(data){
            // self.loadcars();
            // self.loadParamList();
            self.product = {};
            defer.resolve();
          }, function(err){
            console.log(err);
            self.isSaving = false;
            defer.reject(err);
          });
  return defer.promise;
},
'create': function(products){
  var defer = $q.defer();
  self.isSaving = true;
  var Product = new productsService(products);

  Product.$save(function(data){
   self.tempAncestors = [];
   self.product = {};
   self.isSaving = false;
   self.hasMore = true;
   self.isLoading = false;
   self.page = 1;
   self.count = 25;
   self.loadproducts();
   defer.resolve();
 }, function(err){
  console.log(err);
  defer.reject(err);
});
  return defer.promise;
},'delete': function(Product){
  var defer = $q.defer();
  self.isSaving = true;
  var ProductDelete = new productsService({ _id : Product._id});
  ProductDelete.$remove(function(data){
    self.productList = [];
    self.isSaving = false;
    self.hasMore = true;
    self.isLoading = false;
    self.page = 1;
    self.count = 25;
    self.loadproducts();
    defer.resolve();
  }, function(err){
    console.log(err);
    defer.reject(err);
  });
  return defer.promise;
},
'doOrder': function(order){
  self.hasMore = true;
  self.isLoading = false;
  self.page = 1;
  self.cars = [];
  self.ordering = order;
  self.count = 25;
  self.loadcars();
},
'doSearch': function(search){
  self.hasMore = true;
  self.isLoading = false;
  self.total = 0;
  self.page = 1;
  self.search.name = self.productName;
  self.count = 15;
  self.loadproducts();
},
'changeCost': function(){
  if(self.product.neto){
          self.applyTax();
        }else{
          self.getPriceNeto();
  }
},'unoVentaNetoChange': function(){
 self.product.precios.uno.pVenta = self.pVentaUnoTax(self.product.precios.uno.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.uno.p_ventaNeto) : 0;
 self.product.precios.uno.m_utilidad = self.getUtilidad(self.product.precios.uno.p_ventaNeto) ? self.getUtilidad(self.product.precios.uno.p_ventaNeto) : 0;
},'unoUtilidad': function(view){
 self.product.precios.uno.p_ventaNeto  = self.getUtilidadPorcentaje(view);
 self.product.precios.uno.pVenta = self.pVentaUnoTax(self.product.precios.uno.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.uno.p_ventaNeto) : 0;
},'dosVentaNetoChange': function(){
 self.product.precios.dos.pVenta = self.pVentaUnoTax(self.product.precios.dos.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.dos.p_ventaNeto) : 0;
 self.product.precios.dos.m_utilidad = self.getUtilidad(self.product.precios.dos.p_ventaNeto) ? self.getUtilidad(self.product.precios.dos.p_ventaNeto) : 0;
},'dosUtilidad': function(view){
 self.product.precios.dos.p_ventaNeto  = self.getUtilidadPorcentaje(view);
 self.product.precios.dos.pVenta = self.pVentaUnoTax(self.product.precios.dos.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.dos.p_ventaNeto) : 0;
},'tresVentaNetoChange': function(){
 self.product.precios.tres.pVenta = self.pVentaUnoTax(self.product.precios.tres.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.tres.p_ventaNeto) : 0;
 self.product.precios.tres.m_utilidad = self.getUtilidad(self.product.precios.tres.p_ventaNeto) ? self.getUtilidad(self.product.precios.tres.p_ventaNeto) : 0;
},'tresUtilidad': function(view){
 self.product.precios.tres.p_ventaNeto  = self.getUtilidadPorcentaje(view);
 self.product.precios.tres.pVenta = self.pVentaUnoTax(self.product.precios.tres.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.tres.p_ventaNeto) : 0;
},'cuatroVentaNetoChange': function(){
 self.product.precios.cuatro.pVenta = self.pVentaUnoTax(self.product.precios.cuatro.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.cuatro.p_ventaNeto) : 0;
 self.product.precios.cuatro.m_utilidad = self.getUtilidad(self.product.precios.cuatro.p_ventaNeto) ? self.getUtilidad(self.product.precios.cuatro.p_ventaNeto) : 0;
},'cuatroUtilidad': function(view){
 self.product.precios.cuatro.p_ventaNeto  = self.getUtilidadPorcentaje(view);
 self.product.precios.cuatro.pVenta = self.pVentaUnoTax(self.product.precios.cuatro.p_ventaNeto) ? self.pVentaUnoTax(self.product.precios.cuatro.p_ventaNeto) : 0;
},'watchFilters': function () {
  $rootScope.$watch(function () {
    return self.productName;
  }, function (newVal) {
    if (angular.isDefined(newVal)) {
      self.doSearch();
    }
  });

  // $rootScope.$watch(function () {
  //  if(!self.product.precios)
  //   {return;
  //   }else{
  //     return self.product.precios.uno.p_ventaNeto;
  //   }
  // }, function (newVal, oldValue) {
  //   if (angular.isDefined(newVal)) {
  //     self.product.precios.uno.pVenta = self.pVentaUnoTax(newVal) ? self.pVentaUnoTax(newVal) : 0;
  //     self.product.precios.uno.m_utilidad = self.getUtilidad(newVal) ? self.getUtilidad(newVal) : 0;
  //   }
  // });

  $rootScope.$watch(function () {
    if(!self.product.precios)
      {return;
      }else{
       return self.product.precios.dos.p_ventaNeto;
     }
   }, function (newVal) {
    if (angular.isDefined(newVal)){
      self.product.precios.dos.pVenta = self.pVentaUnoTax(newVal);
      self.product.precios.dos.m_utilidad = self.getUtilidad(newVal);
    }
  });

  $rootScope.$watch(function () {
   if(!self.product.precios)
    {return;
    }else{
     return self.product.precios.tres.p_ventaNeto;
   }
 }, function (newVal) {
  if (angular.isDefined(newVal)){
    self.product.precios.tres.pVenta = self.pVentaUnoTax(newVal);
    self.product.precios.tres.m_utilidad = self.getUtilidad(newVal);
  }
});

 $rootScope.$watch(function () {
    if(!self.product.precios)
      {return;
      }else{
        return self.product.precios.cuatro.p_ventaNeto;
      }
    }, function (newVal) {
      if (angular.isDefined(newVal)){
        self.product.precios.cuatro.pVenta = self.pVentaUnoTax(newVal);
        self.product.precios.cuatro.m_utilidad = self.getUtilidad(newVal);
      }
    });

    $rootScope.$watch(function () {
      if(!self.product.precios)
        {return;
        }else{
         return self.product.precios.dos.p_ventaNeto;
       }
     }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.product.precios.dos.pVenta  = self.pVentaUnoTax(newVal);
      }
    });

    $rootScope.$watch(function () {
      return self.product.cost;
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        if(self.product.neto){
          self.applyTax();
        }else{
          self.getPriceNeto();
        }
      }
    });

   $rootScope.$watch(function() {
    if(!self.product.precios)
        {return;
        }else{
         return self.product.precios.uno.m_utilidad;
     }
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.product.precios.uno.p_ventaNeto  = self.getUtilidadPorcentaje(newVal);
      }
    });

    $rootScope.$watch(function() {
      if(!self.product.precios)
        {return;
        }else{
         return self.product.precios.dos.m_utilidad;
     }

    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.product.precios.dos.p_ventaNeto  = self.getUtilidadPorcentaje(newVal);
      }
    });

  $rootScope.$watch(function() {
     if(!self.product.precios)
        {return;
        }else{
         return self.product.precios.tres.m_utilidad;
     }
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.product.precios.tres.p_ventaNeto  = self.getUtilidadPorcentaje(newVal);
      }
    });

    $rootScope.$watch( function() {
     if(!self.product.precios)
      {return;
      }else{
        return self.product.precios.cuatro.m_utilidad;
      }
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        self.product.precios.cuatro.p_ventaNeto  = self.getUtilidadPorcentaje(newVal);
      }
    });

    $rootScope.$watch(function() {
      return self.product.unidades;
    }, function (newVal) {
      if (angular.isDefined(newVal)) {
        if(self.product.neto){
          self.applyTax();
        }else{
          self.getPriceNeto();
        }
      }
    });
  },getUtilidadPorcentaje: function(utilidad){
    var result = 0;
    if(self.product.cost > 0){
      result = self.getMargenByPorcentaje(utilidad, self.product.cost / self.product.unidades);
    }
    return result;
  },applyTax : function(){
    self.product.taxcost = Number(self.amountAfterTax(self.product.cost, self.getTaxAmount(self.product.cost, self.getTax(self.product.taxesFlag, self.companyInfo.impuestosList))));
    self.product.d_cost = self.amountAfterTax((self.product.cost / self.product.unidades), self.getTaxAmount((self.product.cost / self.product.unidades), self.getTax(self.product.taxesFlag, self.companyInfo.impuestosList)));
  },pVentaUnoTax: function(amout){
   return self.amountAfterTax(amout, self.getTaxAmount(amout, self.getTax(self.product.taxesFlag, self.companyInfo.impuestosList)));

 },getMargenByPorcentaje: function(porc, cost){
  var ganancia = ((cost*porc)/100)+cost;
  return ganancia;
},getUtilidad: function(price){
 var result = 0;
 if(self.product.cost > 0){
  result= self.product.precios.uno.p_ventaNeto !== 0 ? self.getMargenByPrice(price, self.product.cost / self.product.unidades) : 0;
}
return result;
},load: function(){
  console.log('loaded');
  return 'load';
},getMargenByPrice: function(price, cost){
  var margen = price >= cost ? ((price*100)/cost)-100 : 0;
  return margen;
},applyAllPriceTax: function(){
  self.product.precios.uno.pVenta = self.pVentaUnoTax(self.product.precios.uno.p_ventaNeto);
  self.product.precios.dos.pVenta = self.pVentaUnoTax(self.product.precios.dos.p_ventaNeto);
  self.product.precios.tres.pVenta = self.pVentaUnoTax(self.product.precios.tres.p_ventaNeto);
  self.product.precios.cuatro.pVenta = self.pVentaUnoTax(self.product.precios.cuatro.p_ventaNeto);
},taxeChange : function(tax, index){
  if(self.product.neto){
    self.product.taxcost = self.amountAfterTax(self.product.cost, self.getTaxAmount(self.product.cost, self.getTax(self.product.taxesFlag, self.companyInfo.impuestosList)));
    self.product.d_cost = self.amountAfterTax((self.product.cost / self.product.unidades), self.getTaxAmount((self.product.cost / self.product.unidades), self.getTax(self.product.taxesFlag, self.companyInfo.impuestosList)));
  }else{
    self.getPriceNeto();
  }
  self.applyAllPriceTax();
},validateUnits: function(){
  if(self.product.unidadVenta._id === self.product.unidadCompra._id){
    self.product.unidades = 1;
  }
},unidChanged: function(){
    self.resetPrices();
   if(self.product.unidades === null){
       self.product.taxcost = 0;
       self.product.d_cost = 0;
   }
   if(self.product.unidades !== null){
     if(self.product.neto){
           self.applyTax();
         }else{
          self.getPriceNeto();
     }
   }
},resetPrices: function(){
  self.product.precios =
        { uno: { pVenta : 0, m_utilidad: 0, p_ventaNeto: 0, p_porMayor: 0 },
          dos: { pVenta : 0, m_utilidad: 0, p_ventaNeto: 0, p_porMayor: 0 },
          tres: { pVenta : 0, m_utilidad: 0, p_ventaNeto: 0, p_porMayor: 0},
          cuatro: { pVenta : 0, m_utilidad: 0, p_ventaNeto: 0, p_porMayor: 0}
      };
}
};
self.loadSucursal();
self.loadproducts();
//self.watchFilters();
return self;
}]);
})();
