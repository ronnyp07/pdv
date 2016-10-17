'use strict';

describe('Compras E2E Tests:', function () {
  describe('Test Compras page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/compras');
      expect(element.all(by.repeater('compra in compras')).count()).toEqual(0);
    });
  });
});
