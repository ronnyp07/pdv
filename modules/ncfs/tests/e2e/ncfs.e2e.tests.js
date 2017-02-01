'use strict';

describe('Ncfs E2E Tests:', function () {
  describe('Test Ncfs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ncfs');
      expect(element.all(by.repeater('ncf in ncfs')).count()).toEqual(0);
    });
  });
});
