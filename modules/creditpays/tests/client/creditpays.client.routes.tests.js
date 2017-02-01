(function () {
  'use strict';

  describe('Creditpays Route Tests', function () {
    // Initialize global variables
    var $scope,
      CreditpaysService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CreditpaysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CreditpaysService = _CreditpaysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('creditpays');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/creditpays');
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
          CreditpaysController,
          mockCreditpay;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('creditpays.view');
          $templateCache.put('modules/creditpays/client/views/view-creditpay.client.view.html', '');

          // create mock Creditpay
          mockCreditpay = new CreditpaysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Creditpay Name'
          });

          //Initialize Controller
          CreditpaysController = $controller('CreditpaysController as vm', {
            $scope: $scope,
            creditpayResolve: mockCreditpay
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:creditpayId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.creditpayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            creditpayId: 1
          })).toEqual('/creditpays/1');
        }));

        it('should attach an Creditpay to the controller scope', function () {
          expect($scope.vm.creditpay._id).toBe(mockCreditpay._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/creditpays/client/views/view-creditpay.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CreditpaysController,
          mockCreditpay;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('creditpays.create');
          $templateCache.put('modules/creditpays/client/views/form-creditpay.client.view.html', '');

          // create mock Creditpay
          mockCreditpay = new CreditpaysService();

          //Initialize Controller
          CreditpaysController = $controller('CreditpaysController as vm', {
            $scope: $scope,
            creditpayResolve: mockCreditpay
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.creditpayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/creditpays/create');
        }));

        it('should attach an Creditpay to the controller scope', function () {
          expect($scope.vm.creditpay._id).toBe(mockCreditpay._id);
          expect($scope.vm.creditpay._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/creditpays/client/views/form-creditpay.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CreditpaysController,
          mockCreditpay;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('creditpays.edit');
          $templateCache.put('modules/creditpays/client/views/form-creditpay.client.view.html', '');

          // create mock Creditpay
          mockCreditpay = new CreditpaysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Creditpay Name'
          });

          //Initialize Controller
          CreditpaysController = $controller('CreditpaysController as vm', {
            $scope: $scope,
            creditpayResolve: mockCreditpay
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:creditpayId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.creditpayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            creditpayId: 1
          })).toEqual('/creditpays/1/edit');
        }));

        it('should attach an Creditpay to the controller scope', function () {
          expect($scope.vm.creditpay._id).toBe(mockCreditpay._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/creditpays/client/views/form-creditpay.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
