'use strict';

describe('Cierreturnos E2E Tests:', function () {
  describe('Test Cierreturnos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cierreturnos');
      expect(element.all(by.repeater('cierreturno in cierreturnos')).count()).toEqual(0);
    });
  });
});
