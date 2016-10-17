'use strict';

describe('Sucursals E2E Tests:', function () {
  describe('Test Sucursals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sucursals');
      expect(element.all(by.repeater('sucursal in sucursals')).count()).toEqual(0);
    });
  });
});
