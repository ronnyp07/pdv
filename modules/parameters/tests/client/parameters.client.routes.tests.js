(function () {
  'use strict';

  describe('Parameters Route Tests', function () {
    // Initialize global variables
    var $scope,
      ParametersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ParametersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ParametersService = _ParametersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('parameters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/parameters');
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
          ParametersController,
          mockParameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('parameters.view');
          $templateCache.put('modules/parameters/client/views/view-parameter.client.view.html', '');

          // create mock Parameter
          mockParameter = new ParametersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Parameter Name'
          });

          //Initialize Controller
          ParametersController = $controller('ParametersController as vm', {
            $scope: $scope,
            parameterResolve: mockParameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:parameterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.parameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            parameterId: 1
          })).toEqual('/parameters/1');
        }));

        it('should attach an Parameter to the controller scope', function () {
          expect($scope.vm.parameter._id).toBe(mockParameter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/parameters/client/views/view-parameter.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ParametersController,
          mockParameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('parameters.create');
          $templateCache.put('modules/parameters/client/views/form-parameter.client.view.html', '');

          // create mock Parameter
          mockParameter = new ParametersService();

          //Initialize Controller
          ParametersController = $controller('ParametersController as vm', {
            $scope: $scope,
            parameterResolve: mockParameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.parameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/parameters/create');
        }));

        it('should attach an Parameter to the controller scope', function () {
          expect($scope.vm.parameter._id).toBe(mockParameter._id);
          expect($scope.vm.parameter._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/parameters/client/views/form-parameter.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ParametersController,
          mockParameter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('parameters.edit');
          $templateCache.put('modules/parameters/client/views/form-parameter.client.view.html', '');

          // create mock Parameter
          mockParameter = new ParametersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Parameter Name'
          });

          //Initialize Controller
          ParametersController = $controller('ParametersController as vm', {
            $scope: $scope,
            parameterResolve: mockParameter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:parameterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.parameterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            parameterId: 1
          })).toEqual('/parameters/1/edit');
        }));

        it('should attach an Parameter to the controller scope', function () {
          expect($scope.vm.parameter._id).toBe(mockParameter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/parameters/client/views/form-parameter.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
