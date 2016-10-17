(function () {
  'use strict';

  describe('Providers Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProvidersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProvidersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProvidersService = _ProvidersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('providers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/providers');
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
          ProvidersController,
          mockProvider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('providers.view');
          $templateCache.put('modules/providers/client/views/view-provider.client.view.html', '');

          // create mock Provider
          mockProvider = new ProvidersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Provider Name'
          });

          //Initialize Controller
          ProvidersController = $controller('ProvidersController as vm', {
            $scope: $scope,
            providerResolve: mockProvider
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:providerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.providerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            providerId: 1
          })).toEqual('/providers/1');
        }));

        it('should attach an Provider to the controller scope', function () {
          expect($scope.vm.provider._id).toBe(mockProvider._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/providers/client/views/view-provider.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProvidersController,
          mockProvider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('providers.create');
          $templateCache.put('modules/providers/client/views/form-provider.client.view.html', '');

          // create mock Provider
          mockProvider = new ProvidersService();

          //Initialize Controller
          ProvidersController = $controller('ProvidersController as vm', {
            $scope: $scope,
            providerResolve: mockProvider
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.providerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/providers/create');
        }));

        it('should attach an Provider to the controller scope', function () {
          expect($scope.vm.provider._id).toBe(mockProvider._id);
          expect($scope.vm.provider._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/providers/client/views/form-provider.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProvidersController,
          mockProvider;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('providers.edit');
          $templateCache.put('modules/providers/client/views/form-provider.client.view.html', '');

          // create mock Provider
          mockProvider = new ProvidersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Provider Name'
          });

          //Initialize Controller
          ProvidersController = $controller('ProvidersController as vm', {
            $scope: $scope,
            providerResolve: mockProvider
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:providerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.providerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            providerId: 1
          })).toEqual('/providers/1/edit');
        }));

        it('should attach an Provider to the controller scope', function () {
          expect($scope.vm.provider._id).toBe(mockProvider._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/providers/client/views/form-provider.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
