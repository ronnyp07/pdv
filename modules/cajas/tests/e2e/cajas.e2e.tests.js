'use strict';

describe('Cajas E2E Tests:', function () {
  describe('Test Cajas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cajas');
      expect(element.all(by.repeater('caja in cajas')).count()).toEqual(0);
    });
  });
});
