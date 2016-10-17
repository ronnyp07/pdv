'use strict';

describe('Abonos E2E Tests:', function () {
  describe('Test Abonos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/abonos');
      expect(element.all(by.repeater('abono in abonos')).count()).toEqual(0);
    });
  });
});
