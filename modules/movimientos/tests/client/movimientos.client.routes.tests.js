(function () {
  'use strict';

  describe('Movimientos Route Tests', function () {
    // Initialize global variables
    var $scope,
      MovimientosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MovimientosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MovimientosService = _MovimientosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('movimientos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/movimientos');
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
          MovimientosController,
          mockMovimiento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('movimientos.view');
          $templateCache.put('modules/movimientos/client/views/view-movimiento.client.view.html', '');

          // create mock Movimiento
          mockMovimiento = new MovimientosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movimiento Name'
          });

          //Initialize Controller
          MovimientosController = $controller('MovimientosController as vm', {
            $scope: $scope,
            movimientoResolve: mockMovimiento
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:movimientoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.movimientoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            movimientoId: 1
          })).toEqual('/movimientos/1');
        }));

        it('should attach an Movimiento to the controller scope', function () {
          expect($scope.vm.movimiento._id).toBe(mockMovimiento._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/movimientos/client/views/view-movimiento.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MovimientosController,
          mockMovimiento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('movimientos.create');
          $templateCache.put('modules/movimientos/client/views/form-movimiento.client.view.html', '');

          // create mock Movimiento
          mockMovimiento = new MovimientosService();

          //Initialize Controller
          MovimientosController = $controller('MovimientosController as vm', {
            $scope: $scope,
            movimientoResolve: mockMovimiento
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.movimientoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/movimientos/create');
        }));

        it('should attach an Movimiento to the controller scope', function () {
          expect($scope.vm.movimiento._id).toBe(mockMovimiento._id);
          expect($scope.vm.movimiento._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/movimientos/client/views/form-movimiento.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MovimientosController,
          mockMovimiento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('movimientos.edit');
          $templateCache.put('modules/movimientos/client/views/form-movimiento.client.view.html', '');

          // create mock Movimiento
          mockMovimiento = new MovimientosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movimiento Name'
          });

          //Initialize Controller
          MovimientosController = $controller('MovimientosController as vm', {
            $scope: $scope,
            movimientoResolve: mockMovimiento
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:movimientoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.movimientoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            movimientoId: 1
          })).toEqual('/movimientos/1/edit');
        }));

        it('should attach an Movimiento to the controller scope', function () {
          expect($scope.vm.movimiento._id).toBe(mockMovimiento._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/movimientos/client/views/form-movimiento.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
