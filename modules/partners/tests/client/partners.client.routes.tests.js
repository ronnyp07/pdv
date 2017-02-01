(function () {
  'use strict';

  describe('Partners Route Tests', function () {
    // Initialize global variables
    var $scope,
      PartnersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PartnersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PartnersService = _PartnersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('partners');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/partners');
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
          PartnersController,
          mockPartner;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('partners.view');
          $templateCache.put('modules/partners/client/views/view-partner.client.view.html', '');

          // create mock Partner
          mockPartner = new PartnersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Partner Name'
          });

          //Initialize Controller
          PartnersController = $controller('PartnersController as vm', {
            $scope: $scope,
            partnerResolve: mockPartner
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:partnerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.partnerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            partnerId: 1
          })).toEqual('/partners/1');
        }));

        it('should attach an Partner to the controller scope', function () {
          expect($scope.vm.partner._id).toBe(mockPartner._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/partners/client/views/view-partner.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PartnersController,
          mockPartner;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('partners.create');
          $templateCache.put('modules/partners/client/views/form-partner.client.view.html', '');

          // create mock Partner
          mockPartner = new PartnersService();

          //Initialize Controller
          PartnersController = $controller('PartnersController as vm', {
            $scope: $scope,
            partnerResolve: mockPartner
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.partnerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/partners/create');
        }));

        it('should attach an Partner to the controller scope', function () {
          expect($scope.vm.partner._id).toBe(mockPartner._id);
          expect($scope.vm.partner._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/partners/client/views/form-partner.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PartnersController,
          mockPartner;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('partners.edit');
          $templateCache.put('modules/partners/client/views/form-partner.client.view.html', '');

          // create mock Partner
          mockPartner = new PartnersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Partner Name'
          });

          //Initialize Controller
          PartnersController = $controller('PartnersController as vm', {
            $scope: $scope,
            partnerResolve: mockPartner
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:partnerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.partnerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            partnerId: 1
          })).toEqual('/partners/1/edit');
        }));

        it('should attach an Partner to the controller scope', function () {
          expect($scope.vm.partner._id).toBe(mockPartner._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/partners/client/views/form-partner.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
