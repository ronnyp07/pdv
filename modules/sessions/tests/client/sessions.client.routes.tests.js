(function () {
  'use strict';

  describe('Sessions Route Tests', function () {
    // Initialize global variables
    var $scope,
      SessionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SessionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SessionsService = _SessionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sessions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sessions');
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
          SessionsController,
          mockSession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sessions.view');
          $templateCache.put('modules/sessions/client/views/view-session.client.view.html', '');

          // create mock Session
          mockSession = new SessionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Session Name'
          });

          //Initialize Controller
          SessionsController = $controller('SessionsController as vm', {
            $scope: $scope,
            sessionResolve: mockSession
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:sessionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.sessionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            sessionId: 1
          })).toEqual('/sessions/1');
        }));

        it('should attach an Session to the controller scope', function () {
          expect($scope.vm.session._id).toBe(mockSession._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sessions/client/views/view-session.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SessionsController,
          mockSession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sessions.create');
          $templateCache.put('modules/sessions/client/views/form-session.client.view.html', '');

          // create mock Session
          mockSession = new SessionsService();

          //Initialize Controller
          SessionsController = $controller('SessionsController as vm', {
            $scope: $scope,
            sessionResolve: mockSession
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.sessionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sessions/create');
        }));

        it('should attach an Session to the controller scope', function () {
          expect($scope.vm.session._id).toBe(mockSession._id);
          expect($scope.vm.session._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sessions/client/views/form-session.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SessionsController,
          mockSession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sessions.edit');
          $templateCache.put('modules/sessions/client/views/form-session.client.view.html', '');

          // create mock Session
          mockSession = new SessionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Session Name'
          });

          //Initialize Controller
          SessionsController = $controller('SessionsController as vm', {
            $scope: $scope,
            sessionResolve: mockSession
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:sessionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.sessionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            sessionId: 1
          })).toEqual('/sessions/1/edit');
        }));

        it('should attach an Session to the controller scope', function () {
          expect($scope.vm.session._id).toBe(mockSession._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sessions/client/views/form-session.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
