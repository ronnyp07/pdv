'use strict';

describe('Parameters E2E Tests:', function () {
  describe('Test Parameters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/parameters');
      expect(element.all(by.repeater('parameter in parameters')).count()).toEqual(0);
    });
  });
});
