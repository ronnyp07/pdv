(function () {
  'use strict';

  describe('Lotes Route Tests', function () {
    // Initialize global variables
    var $scope,
      LotesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LotesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LotesService = _LotesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('lotes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/lotes');
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
          LotesController,
          mockLote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('lotes.view');
          $templateCache.put('modules/lotes/client/views/view-lote.client.view.html', '');

          // create mock Lote
          mockLote = new LotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lote Name'
          });

          //Initialize Controller
          LotesController = $controller('LotesController as vm', {
            $scope: $scope,
            loteResolve: mockLote
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:loteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.loteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            loteId: 1
          })).toEqual('/lotes/1');
        }));

        it('should attach an Lote to the controller scope', function () {
          expect($scope.vm.lote._id).toBe(mockLote._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/lotes/client/views/view-lote.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LotesController,
          mockLote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('lotes.create');
          $templateCache.put('modules/lotes/client/views/form-lote.client.view.html', '');

          // create mock Lote
          mockLote = new LotesService();

          //Initialize Controller
          LotesController = $controller('LotesController as vm', {
            $scope: $scope,
            loteResolve: mockLote
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.loteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/lotes/create');
        }));

        it('should attach an Lote to the controller scope', function () {
          expect($scope.vm.lote._id).toBe(mockLote._id);
          expect($scope.vm.lote._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/lotes/client/views/form-lote.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LotesController,
          mockLote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('lotes.edit');
          $templateCache.put('modules/lotes/client/views/form-lote.client.view.html', '');

          // create mock Lote
          mockLote = new LotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lote Name'
          });

          //Initialize Controller
          LotesController = $controller('LotesController as vm', {
            $scope: $scope,
            loteResolve: mockLote
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:loteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.loteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            loteId: 1
          })).toEqual('/lotes/1/edit');
        }));

        it('should attach an Lote to the controller scope', function () {
          expect($scope.vm.lote._id).toBe(mockLote._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/lotes/client/views/form-lote.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
