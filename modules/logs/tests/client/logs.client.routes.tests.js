(function () {
  'use strict';

  describe('Logs Route Tests', function () {
    // Initialize global variables
    var $scope,
      LogsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LogsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LogsService = _LogsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('logs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/logs');
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
          LogsController,
          mockLog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('logs.view');
          $templateCache.put('modules/logs/client/views/view-log.client.view.html', '');

          // create mock Log
          mockLog = new LogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Log Name'
          });

          //Initialize Controller
          LogsController = $controller('LogsController as vm', {
            $scope: $scope,
            logResolve: mockLog
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:logId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.logResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            logId: 1
          })).toEqual('/logs/1');
        }));

        it('should attach an Log to the controller scope', function () {
          expect($scope.vm.log._id).toBe(mockLog._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/logs/client/views/view-log.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LogsController,
          mockLog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('logs.create');
          $templateCache.put('modules/logs/client/views/form-log.client.view.html', '');

          // create mock Log
          mockLog = new LogsService();

          //Initialize Controller
          LogsController = $controller('LogsController as vm', {
            $scope: $scope,
            logResolve: mockLog
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.logResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/logs/create');
        }));

        it('should attach an Log to the controller scope', function () {
          expect($scope.vm.log._id).toBe(mockLog._id);
          expect($scope.vm.log._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/logs/client/views/form-log.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LogsController,
          mockLog;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('logs.edit');
          $templateCache.put('modules/logs/client/views/form-log.client.view.html', '');

          // create mock Log
          mockLog = new LogsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Log Name'
          });

          //Initialize Controller
          LogsController = $controller('LogsController as vm', {
            $scope: $scope,
            logResolve: mockLog
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:logId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.logResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            logId: 1
          })).toEqual('/logs/1/edit');
        }));

        it('should attach an Log to the controller scope', function () {
          expect($scope.vm.log._id).toBe(mockLog._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/logs/client/views/form-log.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
