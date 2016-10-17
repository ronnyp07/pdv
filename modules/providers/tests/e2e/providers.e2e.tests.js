'use strict';

describe('Providers E2E Tests:', function () {
  describe('Test Providers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/providers');
      expect(element.all(by.repeater('provider in providers')).count()).toEqual(0);
    });
  });
});
