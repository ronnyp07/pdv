(function () {
  'use strict';

  describe('Sucursals Route Tests', function () {
    // Initialize global variables
    var $scope,
      SucursalsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SucursalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SucursalsService = _SucursalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sucursals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sucursals');
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
          SucursalsController,
          mockSucursal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sucursals.view');
          $templateCache.put('modules/sucursals/client/views/view-sucursal.client.view.html', '');

          // create mock Sucursal
          mockSucursal = new SucursalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sucursal Name'
          });

          //Initialize Controller
          SucursalsController = $controller('SucursalsController as vm', {
            $scope: $scope,
            sucursalResolve: mockSucursal
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sucursalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sucursalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sucursalId: 1
          })).toEqual('/sucursals/1');
        }));

        it('should attach an Sucursal to the controller scope', function () {
          expect($scope.vm.sucursal._id).toBe(mockSucursal._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sucursals/client/views/view-sucursal.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SucursalsController,
          mockSucursal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sucursals.create');
          $templateCache.put('modules/sucursals/client/views/form-sucursal.client.view.html', '');

          // create mock Sucursal
          mockSucursal = new SucursalsService();

          //Initialize Controller
          SucursalsController = $controller('SucursalsController as vm', {
            $scope: $scope,
            sucursalResolve: mockSucursal
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sucursalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sucursals/create');
        }));

        it('should attach an Sucursal to the controller scope', function () {
          expect($scope.vm.sucursal._id).toBe(mockSucursal._id);
          expect($scope.vm.sucursal._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sucursals/client/views/form-sucursal.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SucursalsController,
          mockSucursal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sucursals.edit');
          $templateCache.put('modules/sucursals/client/views/form-sucursal.client.view.html', '');

          // create mock Sucursal
          mockSucursal = new SucursalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sucursal Name'
          });

          //Initialize Controller
          SucursalsController = $controller('SucursalsController as vm', {
            $scope: $scope,
            sucursalResolve: mockSucursal
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sucursalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sucursalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sucursalId: 1
          })).toEqual('/sucursals/1/edit');
        }));

        it('should attach an Sucursal to the controller scope', function () {
          expect($scope.vm.sucursal._id).toBe(mockSucursal._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sucursals/client/views/form-sucursal.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
