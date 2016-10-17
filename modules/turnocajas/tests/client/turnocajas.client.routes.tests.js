(function () {
  'use strict';

  describe('Turnocajas Route Tests', function () {
    // Initialize global variables
    var $scope,
      TurnocajasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TurnocajasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TurnocajasService = _TurnocajasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('turnocajas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/turnocajas');
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
          TurnocajasController,
          mockTurnocaja;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('turnocajas.view');
          $templateCache.put('modules/turnocajas/client/views/view-turnocaja.client.view.html', '');

          // create mock Turnocaja
          mockTurnocaja = new TurnocajasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Turnocaja Name'
          });

          //Initialize Controller
          TurnocajasController = $controller('TurnocajasController as vm', {
            $scope: $scope,
            turnocajaResolve: mockTurnocaja
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:turnocajaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.turnocajaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            turnocajaId: 1
          })).toEqual('/turnocajas/1');
        }));

        it('should attach an Turnocaja to the controller scope', function () {
          expect($scope.vm.turnocaja._id).toBe(mockTurnocaja._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/turnocajas/client/views/view-turnocaja.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TurnocajasController,
          mockTurnocaja;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('turnocajas.create');
          $templateCache.put('modules/turnocajas/client/views/form-turnocaja.client.view.html', '');

          // create mock Turnocaja
          mockTurnocaja = new TurnocajasService();

          //Initialize Controller
          TurnocajasController = $controller('TurnocajasController as vm', {
            $scope: $scope,
            turnocajaResolve: mockTurnocaja
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.turnocajaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/turnocajas/create');
        }));

        it('should attach an Turnocaja to the controller scope', function () {
          expect($scope.vm.turnocaja._id).toBe(mockTurnocaja._id);
          expect($scope.vm.turnocaja._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/turnocajas/client/views/form-turnocaja.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TurnocajasController,
          mockTurnocaja;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('turnocajas.edit');
          $templateCache.put('modules/turnocajas/client/views/form-turnocaja.client.view.html', '');

          // create mock Turnocaja
          mockTurnocaja = new TurnocajasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Turnocaja Name'
          });

          //Initialize Controller
          TurnocajasController = $controller('TurnocajasController as vm', {
            $scope: $scope,
            turnocajaResolve: mockTurnocaja
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:turnocajaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.turnocajaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            turnocajaId: 1
          })).toEqual('/turnocajas/1/edit');
        }));

        it('should attach an Turnocaja to the controller scope', function () {
          expect($scope.vm.turnocaja._id).toBe(mockTurnocaja._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/turnocajas/client/views/form-turnocaja.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
