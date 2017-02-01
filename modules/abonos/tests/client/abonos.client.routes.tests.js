(function () {
  'use strict';

  describe('Abonos Route Tests', function () {
    // Initialize global variables
    var $scope,
      AbonosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AbonosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AbonosService = _AbonosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('abonos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/abonos');
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
          AbonosController,
          mockAbono;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('abonos.view');
          $templateCache.put('modules/abonos/client/views/view-abono.client.view.html', '');

          // create mock Abono
          mockAbono = new AbonosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Abono Name'
          });

          //Initialize Controller
          AbonosController = $controller('AbonosController as vm', {
            $scope: $scope,
            abonoResolve: mockAbono
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:abonoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.abonoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            abonoId: 1
          })).toEqual('/abonos/1');
        }));

        it('should attach an Abono to the controller scope', function () {
          expect($scope.vm.abono._id).toBe(mockAbono._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/abonos/client/views/view-abono.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AbonosController,
          mockAbono;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('abonos.create');
          $templateCache.put('modules/abonos/client/views/form-abono.client.view.html', '');

          // create mock Abono
          mockAbono = new AbonosService();

          //Initialize Controller
          AbonosController = $controller('AbonosController as vm', {
            $scope: $scope,
            abonoResolve: mockAbono
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.abonoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/abonos/create');
        }));

        it('should attach an Abono to the controller scope', function () {
          expect($scope.vm.abono._id).toBe(mockAbono._id);
          expect($scope.vm.abono._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/abonos/client/views/form-abono.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AbonosController,
          mockAbono;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('abonos.edit');
          $templateCache.put('modules/abonos/client/views/form-abono.client.view.html', '');

          // create mock Abono
          mockAbono = new AbonosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Abono Name'
          });

          //Initialize Controller
          AbonosController = $controller('AbonosController as vm', {
            $scope: $scope,
            abonoResolve: mockAbono
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:abonoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.abonoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            abonoId: 1
          })).toEqual('/abonos/1/edit');
        }));

        it('should attach an Abono to the controller scope', function () {
          expect($scope.vm.abono._id).toBe(mockAbono._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/abonos/client/views/form-abono.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
