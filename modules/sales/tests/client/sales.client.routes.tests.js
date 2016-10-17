(function () {
  'use strict';

  describe('Sales Route Tests', function () {
    // Initialize global variables
    var $scope,
      SalesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SalesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SalesService = _SalesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('sales');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/sales');
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
          SalesController,
          mockSale;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('sales.view');
          $templateCache.put('modules/sales/client/views/view-sale.client.view.html', '');

          // create mock Sale
          mockSale = new SalesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sale Name'
          });

          //Initialize Controller
          SalesController = $controller('SalesController as vm', {
            $scope: $scope,
            saleResolve: mockSale
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:saleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.saleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            saleId: 1
          })).toEqual('/sales/1');
        }));

        it('should attach an Sale to the controller scope', function () {
          expect($scope.vm.sale._id).toBe(mockSale._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/sales/client/views/view-sale.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SalesController,
          mockSale;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('sales.create');
          $templateCache.put('modules/sales/client/views/form-sale.client.view.html', '');

          // create mock Sale
          mockSale = new SalesService();

          //Initialize Controller
          SalesController = $controller('SalesController as vm', {
            $scope: $scope,
            saleResolve: mockSale
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.saleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/sales/create');
        }));

        it('should attach an Sale to the controller scope', function () {
          expect($scope.vm.sale._id).toBe(mockSale._id);
          expect($scope.vm.sale._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/sales/client/views/form-sale.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SalesController,
          mockSale;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('sales.edit');
          $templateCache.put('modules/sales/client/views/form-sale.client.view.html', '');

          // create mock Sale
          mockSale = new SalesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Sale Name'
          });

          //Initialize Controller
          SalesController = $controller('SalesController as vm', {
            $scope: $scope,
            saleResolve: mockSale
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:saleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.saleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            saleId: 1
          })).toEqual('/sales/1/edit');
        }));

        it('should attach an Sale to the controller scope', function () {
          expect($scope.vm.sale._id).toBe(mockSale._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/sales/client/views/form-sale.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
