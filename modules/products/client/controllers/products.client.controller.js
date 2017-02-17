'use strict';

var productModule = angular.module('parameters')
.controller('ProductsController',
  ['productsService',
  '$scope',
  'ProductRestServices',
  '$http',
  '$q',
  'NgTableParams',
  '$modal',
  '$timeout',
  '$window',
  'Authentication',
  'FileUploader',
  '$state',
  'ParameterRestServices',
  'SucursalsService',
  '$rootScope',
  'Notify',
  'SucursalsRestServices',
  function ProductsListController(
    productsService,
    $scope,
    ProductRestServices,
    $http,
    $q,
    NgTableParams,
    $modal,
    $timeout,
    $window,
    Authentication,
    FileUploader,
    $state,
    ParameterRestServices,
    SucursalsService,
    $rootScope,
    Notify,
    SucursalsRestServices) {

    var vm = this;
  // vm.user = Authentication.user;

  vm.authentication = Authentication;
  vm.userimageURL = vm.authentication.user.profileImageURL;
  vm.paramRestServices = ParameterRestServices;
  vm.sucursalServices = SucursalsRestServices;
  //vm.sucursalList = SucursalsService.query();
  vm.productServices = ProductRestServices;
  vm.productServices.companyInfo =  vm.authentication.sucursalCache.get('company');

  init();

   // Create file uploader instance
   vm.uploader = new FileUploader({
    url: '/api/products'
  });

   function init(){
    vm.taxesFlag = {};
    vm.productServices.product= {
      d_cost: 0,
      taxcost: 0,
      neto: true,
      precios: {
        uno: {
          pVenta : 0,
          m_utilidad: 0,
          p_ventaNeto: 0,
          p_porMayor: 0,
          no: 1
        },
        dos: {
          pVenta : 0,
          m_utilidad: 0,
          p_ventaNeto: 0,
          p_porMayor: 0,
          no: 2
        },
        tres: {
          pVenta : 0,
          m_utilidad: 0,
          p_ventaNeto: 0,
          p_porMayor: 0,
          no: 3
        },
        cuatro: {
          pVenta : 0,
          m_utilidad: 0,
          p_ventaNeto: 0,
          p_porMayor: 0,
          no:4
        }
      }
    };

    //vm.productServices.companyInfo.impuestosList
    vm.productServices.product.cost = 0;
    vm.productServices.product.price = 0;
    vm.productServices.product.isActive = true;
    vm.productServices.product.unidadCompra = {_id: 'Piezas', name: 'Piezas'};
    vm.productServices.product.unidadVenta = {_id: 'Piezas', name: 'Piezas'};
    vm.productServices.product.isPOS = true;
    vm.productServices.product.minimumStock = 0;
    vm.productServices.product.maximumStock = 0;
    vm.productServices.product.inStock = 0;
    vm.productServices.product.unidades = 1;
    //vm.productServices.product.sucursalId = {};
    vm.taxes = {};
    vm.newparameter = {
      ancestors: []
    };
    vm.menos = 0;
    vm.d_menos = 0;
    vm.productServices.product.listProductPromotion = [];
    vm.tempPromotion = {};
    vm.imageURL = 'modules/products/img/no-imagen.jpg';
  }

 $scope.testAdd =  function(value){
   vm.createModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/newparameter.html',
     show: true,
     backdrop: 'static'
    });
   vm.newparameter.name = value;
 };

 $scope.addCategory = function(value){
    vm.createModal = $modal({
     scope: $scope,
     'templateUrl': 'modules/products/partials/categoria.html',
     show: true,
     backdrop: 'static'
    });
   vm.newparameter.name = value;
 };

 vm.cancelPopUp = function(value){
      vm.newparameter = {};
      vm.newparameter.newCategory = {};
      vm.createModal.hide();
 };

 vm.createParameter = function(_param, _value){
      var ancestors = [];
      vm.newparameter.companyId = vm.authentication.user.companyId;
      if(vm.newparameter.newCategory !== undefined){
           ancestors = vm.paramRestServices.joinAncestors(vm.newparameter.newCategory);
           ancestors.push(vm.newparameter.newCategory._id);
           vm.newparameter.ancestors = ancestors;
           vm.newparameter.parent = vm.newparameter.newCategory._id;
      }else{
           vm.newparameter.ancestors.push('Categoria');
           vm.newparameter.parent = 'Categoria';
      }
      vm.paramRestServices.create(vm.newparameter).then(function(data){
       vm.createModal.hide();
       console.log(data);
        vm.productServices.product.category = {_id: data._id, desc: data._id};
        alertify.success('Acción realizada exitosamente!!');
       }, function(err){
        alertify.error(err.data.message);
      });
 };

 //Genera clave para el producto
vm.generateKey = function(){
   //var rString = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  vm.productServices.product.bardCode = randomString(12, '0123456789');
};

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

 vm.categoryChange = function(_param){
    vm.subCategoryList = [];
    vm.productServices.product.Subcategory = null;
    vm.paramRestServices.getParamsFilterByParent('', _param).then(function(data){
     vm.subCategoryList = data;
    });
 };

 vm.product = productsService.query();
 vm.product = {};
 vm.product.qt = 1;

 var params = {
    page: 1,
    count: 3
  };

 //=====================
 // vm.productServices.getPriceNeto = function(){
 //   vm.productServices.product.taxcost = vm.productServices.product.cost;
 //   vm.productServices.product.d_cost = vm.productServices.product.cost / vm.productServices.product.unidades;
 // };

//  vm.validateUnits = function(){
//    if(vm.productServices.product.unidadVenta._id === vm.productServices.product.unidadCompra._id){
//     vm.productServices.product.unidades = 1;
//   }
// };

function setTax(val, tax){
  if(val){
    vm.productServices.product.taxcost -= calculateTaxes(val,  tax.imp_Porcentaje);
  }else {
    vm.productServices.product.taxcost += calculateTaxes(val, tax.imp_Porcentaje);
  }
}

vm.calculateTaxes = function(val, taxValue){
  if(val){
    vm.menos += vm.productServices.product.cost * taxValue / 100;
    vm.d_menos += (vm.productServices.product.cost / vm.productServices.product.unidades) * taxValue / 100;
  }
};

function pVentaUnoTax(amout){
 return vm.productServices.amountAfterTax(amout, vm.productServices.getTaxAmount(amout, vm.productServices.getTax(vm.productServices.product.taxesFlag, vm.productServices.companyInfo.impuestosList)));
}

//Aplica el itbis a todos los detalles del precio
function applyAllPriceTax(){
  vm.productServices.product.precios.uno.pVenta = pVentaUnoTax(vm.productServices.product.precios.uno.p_ventaNeto);
  vm.productServices.product.precios.dos.pVenta = pVentaUnoTax(vm.productServices.product.precios.dos.p_ventaNeto);
  vm.productServices.product.precios.tres.pVenta = pVentaUnoTax(vm.productServices.product.precios.tres.p_ventaNeto);
  vm.productServices.product.precios.cuatro.pVenta = pVentaUnoTax(vm.productServices.product.precios.cuatro.p_ventaNeto);
}

vm.applyNeto = function(){
  if(!vm.productServices.product.neto){
    vm.productServices.getPriceNeto();
  }else {
    vm.productServices.applyTax();
  }
};

 function getMargenByPrice(price, cost){
  var margen = price >= cost ? ((price*100)/cost)-100 : 0;
  return margen;
}

function getMargenByPorcentaje(porc, cost){
  var ganancia = ((cost*porc)/100)+cost;
  return ganancia;
}

function getUtilidad(price){
 var result = 0;
 if(vm.productServices.product.cost > 0){
  result= vm.productServices.product.precios.uno.p_ventaNeto !== 0 ? getMargenByPrice(price, vm.productServices.product.cost / vm.productServices.product.unidades) : 0;
}
return result;
}

function getUtilidadPorcentaje(utilidad){
  var result = 0;
  if(vm.productServices.product.cost > 0){
    result = getMargenByPorcentaje(utilidad, vm.productServices.product.cost / vm.productServices.product.unidades);
  }
  return result;
}

vm.editAppKey = function(field) {
  vm.product.Editvalue = field.qt;
  vm.productServices.tempSelectedProduct = field;
};

vm.tableParams = new NgTableParams({}, {
  dataset: angular.copy(vm.productServices.listProductPromotion)
});

vm.saveField = function(index, product) {
  if(vm.editMode){
    vm.productServices.product.listProductPromotion[index].total = Number(vm.product.Editvalue) * Number(product.price);
    vm.productServices.product.listProductPromotion[index].qt = Number(vm.product.Editvalue);
    vm.product.Editvalue = null;
  }
};

  // Set file uploader image filter
 vm.uploader.filters.push({
    name: 'imageFilter',
    fn: function (item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

  vm.uploader.onBeforeUploadItem = function (item) {
    vm.productServices.product.sucursalId = vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId._id : vm.authentication.sucursal.sucursalId._id;
    vm.productServices.product.unidadCompra = vm.productServices.product.unidadCompra ? vm.productServices.product.unidadCompra._id: '';
    vm.productServices.product.unidadVenta = vm.productServices.product.unidadVenta ? vm.productServices.product.unidadVenta._id : '';
    vm.productServices.product.category = vm.productServices.product.category ? vm.productServices.product.category._id : '';
    item.formData.push(vm.productServices.product);
  };

 // Called after the user selected a new picture file
 vm.uploader.onAfterAddingFile = function (fileItem) {
  if ($window.FileReader) {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileItem._file);
    fileReader.onload = function (fileReaderEvent) {
      $timeout(function () {
        vm.imageURL = fileReaderEvent.target.result;
      }, 0);
    };
  }
};

vm.saveProduct = function(product, isValid){
  if(vm.authentication.sucursal === 'superUser' && !vm.productServices.product.sucursalId){
    alertify.error('Seleccionar almacen!!');
  }else{
    if ( isValid) {
      if(vm.uploader.queue.length > 0){
        vm.uploader.uploadAll();
      }else{
        product.sucursalId =  vm.productServices.product.sucursalId ? vm.productServices.product.sucursalId : vm.authentication.sucursal.sucursalId._id;
        vm.productServices.create(product).then(function(){
         init();
         $state.go('products.list');
         Notify.sendMsg('refreshProduct', {});
         alertify.success('Acción realizada exitosamente!!');
       }, function(err){
         alertify.error(err.data.message);
       });
     }
   }else{
    alertify.error('Completar los campos requeridos');
  }
}
};

vm.addToCart = function(product){
  product.qt = Number(vm.product.qt) === null ? Number(vm.product.qt) : 1 ;
  product.total = Number(product.qt) * Number(product.precios.uno.p_ventaNeto);
  vm.productServices.product.listProductPromotion.push({product: product._id, name: product.name, qt: product.qt, total: product.total, cost: product.cost, price: product.precios.uno.p_ventaNeto});
  resetPromoForm();
};

vm.selectedProduct = function(product){
 if(vm.productServices.product.listProductPromotion.length > 0){
  if(_.findIndex(vm.productServices.product.listProductPromotion, function(o) { return o.product === product._id; }) >=0){
   var index = _.findIndex(vm.productServices.product.listProductPromotion, function(o) { return o.product === product._id; });
   vm.productServices.product.listProductPromotion[index].qt += Number(vm.product.qt) ? Number(vm.product.qt) : 1;
   vm.productServices.product.listProductPromotion[index].total = Number(vm.productServices.product.listProductPromotion[index].qt) * Number(product.precios.uno.p_ventaNeto);
   vm.productServices.product.promotionItems= null;
   vm.product.qt = 1;
 }else{
   vm.addToCart(product);
 }
}else{
 vm.addToCart(product);
}
};

//Valida el cambio de sucursal en modo superUser
vm.validateSucursalForm = function(){
   if(vm.productServices.product.listProductPromotion.length > 0){
        vm.productServices.product.listProductPromotion = [];
   }
};

function resetPromoForm(){
 vm.productServices.product.promotionItems= null;
 vm.product.qt = 1;
}
    // Cancel the upload process
    vm.cancelUpload = function(){
      vm.uploader.cancelAll();
      vm.uploader.clearQueue();
    };

    vm.deletePromoItem = function(index) {
     vm.productServices.product.listProductPromotion.splice(index, 1);
   };

   vm.cancel = function(){
    vm.uploader.cancelAll();
    vm.uploader.clearQueue();
    vm.imageURL = 'modules/products/img/no-imagen.jpg';
  };

  vm.cancelForm = function(){
    $state.go('products.list');
  };
    // Called after the user has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      //if(response.productPromotion){

       // response.category = response.category ? vm.productServices.product.category: null;
       // response.unidadVenta = response.unidadVenta ? vm.productServices.product.unidadVenta._id: null;
       // response.unidadCompra =
       response.listProductPromotion = vm.productServices.product.listProductPromotion;
       response.taxesFlag = vm.productServices.product.taxesFlag;
       response.precios = vm.productServices.product.precios;
       // vm.productServices.product._id = response._id;
       // vm.productServices.product.unidadCompra = vm.productServices.product.unidadCompra._id;
       // vm.productServices.product.unidadVenta  = vm.productServices.product.unidadVenta._id;
       // vm.productServices.product.category = vm.productServices.product.category._id;
       vm.productServices.updateProduct(response).then(function(){
        init();
        Notify.sendMsg('refreshProduct', {});
        $state.go('products.list');
      });
     //}
      // Show success message
      vm.success = true;
      // Populate user object
      vm.user = Authentication.user = response;
      // Clear upload buttons
      vm.cancel();
    };

  // Cancel the upload process
  vm.cancelUpload = function () {
    vm.uploader.clearQueue();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

    vm.notResult = function(){
      console.log('not result');
    };

    var settings = {
     filterDelay: 300,
     total: 0,
     getData: function(params) {
      return productsService.get(params.url()).$promise.then(function(data) {
        $scope.total = data.total;
        params.total(data.total);
        return data.results;
      });
    }
  };

  /* jshint ignore:start */
  $scope.tableParams = new NgTableParams({}, settings);
  $scope.test = function(){
   console.log('test');
 };

 $scope.createProduct = function(product, valid){
  if(valid){
    if(vm.productServices.saveMode === 'create'){

      vm.paramRestServices.create(vm.paramRestServices.product).then(function(){
        vm.createModal.hide();
        vm.reloadList();
        alertify.success('Acción realizada exitosamente!!');
      }, function(){
        alertify.error('Ha ocurrido un error en el sistema!!');
      });
    }
    if(vm.productServices.saveMode === 'update'){
      vm.paramRestServices.updateProduct(vm.paramRestServices.product).then(function(){
        vm.createModal.hide();
        vm.reloadList();
        alertify.success('Acción realizada exitosamente!!');
        vm.productServices.saveMode = '';
      });
    }
  }else{
    alertify.error('Informacion incompleta!!');
  }
};

vm.delete = function(product){
  if(product.systemParam){
    alertify.error('No puede eliminar un parametro del sistema!!');
  }else{
    vm.productServices.delete(product).then(function(data){
      alertify.success('Acción realizada exitosamente!!');
    });
  }
};

vm.reloadList = function(){
 $scope.tableParams.reload();
};

//Search the product
vm.getProductFilter = function(param){
  var defer = $q.defer();
  var parm = {
    bardCode: param,
    sucursalId: vm.authentication.sucursal === 'superUser' ? vm.productServices.product.sucursalId._id : vm.authentication.sucursal.sucursalId._id
  };
  vm.productServices.getProductFilter(parm)
  .then(function(data){
    defer.resolve(data);
  });
  return defer.promise;
};

$scope.getParamsFilter = function(val){
  var data = {
    id: val
  };
  var result = [];
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
};
}]);

