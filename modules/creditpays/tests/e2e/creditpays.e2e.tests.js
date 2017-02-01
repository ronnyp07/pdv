'use strict';

describe('Creditpays E2E Tests:', function () {
  describe('Test Creditpays page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/creditpays');
      expect(element.all(by.repeater('creditpay in creditpays')).count()).toEqual(0);
    });
  });
});
