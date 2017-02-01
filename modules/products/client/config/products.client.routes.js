(function () {
  'use strict';

  angular
    .module('products')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>'
      })
      .state('products.list', {
        url: '',
        templateUrl: 'modules/products/views/list-products.client.view.html',
        controller: 'ProductsListController',
        controllerAs: 'vm'
      })
      .state('products.create', {
        url: '/create',
        templateUrl: 'modules/products/views/form-product.client.view.html',
        controller: 'ProductsController',
        controllerAs: 'vm'
      })
      .state('products.edit', {
        url: '/:productId/edit',
        templateUrl: 'modules/products/views/form-product.client.view.html',
        controller: 'ProductsUpdateController',
        resolve: {

                // A function value resolves to the return
                // value of the function
            load: getProduct

        },
        controllerAs: 'vm'
      })
      .state('products.view', {
        url: '/:productId',
        templateUrl: 'modules/products/client/views/view-product.client.view.html',
        controller: 'ProductsController',
        controllerAs: 'vm',
        resolve: {
          productResolve: getProduct
        },
        data:{
          pageTitle: 'Product {{ articleResolve.name }}'
        }
      });
  }

  getProduct.$inject = ['$stateParams', 'productsService', '$q'];

  function getProduct($stateParams, productsService, $q) {
    var defer = $q.defer();
    productsService.get({
      productId: $stateParams.productId
    }, function(data){
     defer.resolve(data);
    });
    return defer.promise;
  }


  newProduct.$inject = ['ProductsService'];

  function newProduct(ProductsService) {
    return new ProductsService();
  }
})();
