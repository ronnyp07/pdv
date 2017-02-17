(function () {
  'use strict';

  describe('Roles Route Tests', function () {
    // Initialize global variables
    var $scope,
      RolesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RolesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RolesService = _RolesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('roles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/roles');
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
          RolesController,
          mockRole;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('roles.view');
          $templateCache.put('modules/roles/client/views/view-role.client.view.html', '');

          // create mock Role
          mockRole = new RolesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Role Name'
          });

          //Initialize Controller
          RolesController = $controller('RolesController as vm', {
            $scope: $scope,
            roleResolve: mockRole
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:roleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.roleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            roleId: 1
          })).toEqual('/roles/1');
        }));

        it('should attach an Role to the controller scope', function () {
          expect($scope.vm.role._id).toBe(mockRole._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/roles/client/views/view-role.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RolesController,
          mockRole;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('roles.create');
          $templateCache.put('modules/roles/client/views/form-role.client.view.html', '');

          // create mock Role
          mockRole = new RolesService();

          //Initialize Controller
          RolesController = $controller('RolesController as vm', {
            $scope: $scope,
            roleResolve: mockRole
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.roleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/roles/create');
        }));

        it('should attach an Role to the controller scope', function () {
          expect($scope.vm.role._id).toBe(mockRole._id);
          expect($scope.vm.role._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/roles/client/views/form-role.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RolesController,
          mockRole;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('roles.edit');
          $templateCache.put('modules/roles/client/views/form-role.client.view.html', '');

          // create mock Role
          mockRole = new RolesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Role Name'
          });

          //Initialize Controller
          RolesController = $controller('RolesController as vm', {
            $scope: $scope,
            roleResolve: mockRole
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:roleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.roleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            roleId: 1
          })).toEqual('/roles/1/edit');
        }));

        it('should attach an Role to the controller scope', function () {
          expect($scope.vm.role._id).toBe(mockRole._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/roles/client/views/form-role.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
