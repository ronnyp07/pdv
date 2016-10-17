(function () {
  'use strict';

  describe('Compras Route Tests', function () {
    // Initialize global variables
    var $scope,
      ComprasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ComprasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ComprasService = _ComprasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('compras');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/compras');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ComprasController,
          mockCompra;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('compras.view');
          $templateCache.put('modules/compras/client/views/view-compra.client.view.html', '');

          // create mock Compra
          mockCompra = new ComprasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Compra Name'
          });

          //Initialize Controller
          ComprasController = $controller('ComprasController as vm', {
            $scope: $scope,
            compraResolve: mockCompra
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:compraId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.compraResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            compraId: 1
          })).toEqual('/compras/1');
        }));

        it('should attach an Compra to the controller scope', function () {
          expect($scope.vm.compra._id).toBe(mockCompra._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/compras/client/views/view-compra.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ComprasController,
          mockCompra;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('compras.create');
          $templateCache.put('modules/compras/client/views/form-compra.client.view.html', '');

          // create mock Compra
          mockCompra = new ComprasService();

          //Initialize Controller
          ComprasController = $controller('ComprasController as vm', {
            $scope: $scope,
            compraResolve: mockCompra
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.compraResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/compras/create');
        }));

        it('should attach an Compra to the controller scope', function () {
          expect($scope.vm.compra._id).toBe(mockCompra._id);
          expect($scope.vm.compra._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/compras/client/views/form-compra.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ComprasController,
          mockCompra;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('compras.edit');
          $templateCache.put('modules/compras/client/views/form-compra.client.view.html', '');

          // create mock Compra
          mockCompra = new ComprasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Compra Name'
          });

          //Initialize Controller
          ComprasController = $controller('ComprasController as vm', {
            $scope: $scope,
            compraResolve: mockCompra
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:compraId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.compraResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            compraId: 1
          })).toEqual('/compras/1/edit');
        }));

        it('should attach an Compra to the controller scope', function () {
          expect($scope.vm.compra._id).toBe(mockCompra._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/compras/client/views/form-compra.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
