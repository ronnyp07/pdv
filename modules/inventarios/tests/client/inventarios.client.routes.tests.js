(function () {
  'use strict';

  describe('Inventarios Route Tests', function () {
    // Initialize global variables
    var $scope,
      InventariosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InventariosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InventariosService = _InventariosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inventarios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inventarios');
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
          InventariosController,
          mockInventario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inventarios.view');
          $templateCache.put('modules/inventarios/client/views/view-inventario.client.view.html', '');

          // create mock Inventario
          mockInventario = new InventariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventario Name'
          });

          //Initialize Controller
          InventariosController = $controller('InventariosController as vm', {
            $scope: $scope,
            inventarioResolve: mockInventario
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inventarioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inventarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inventarioId: 1
          })).toEqual('/inventarios/1');
        }));

        it('should attach an Inventario to the controller scope', function () {
          expect($scope.vm.inventario._id).toBe(mockInventario._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inventarios/client/views/view-inventario.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InventariosController,
          mockInventario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inventarios.create');
          $templateCache.put('modules/inventarios/client/views/form-inventario.client.view.html', '');

          // create mock Inventario
          mockInventario = new InventariosService();

          //Initialize Controller
          InventariosController = $controller('InventariosController as vm', {
            $scope: $scope,
            inventarioResolve: mockInventario
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inventarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inventarios/create');
        }));

        it('should attach an Inventario to the controller scope', function () {
          expect($scope.vm.inventario._id).toBe(mockInventario._id);
          expect($scope.vm.inventario._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inventarios/client/views/form-inventario.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InventariosController,
          mockInventario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inventarios.edit');
          $templateCache.put('modules/inventarios/client/views/form-inventario.client.view.html', '');

          // create mock Inventario
          mockInventario = new InventariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inventario Name'
          });

          //Initialize Controller
          InventariosController = $controller('InventariosController as vm', {
            $scope: $scope,
            inventarioResolve: mockInventario
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inventarioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inventarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inventarioId: 1
          })).toEqual('/inventarios/1/edit');
        }));

        it('should attach an Inventario to the controller scope', function () {
          expect($scope.vm.inventario._id).toBe(mockInventario._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inventarios/client/views/form-inventario.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
