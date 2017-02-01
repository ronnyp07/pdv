'use strict';

describe('Inventarios E2E Tests:', function () {
  describe('Test Inventarios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inventarios');
      expect(element.all(by.repeater('inventario in inventarios')).count()).toEqual(0);
    });
  });
});
