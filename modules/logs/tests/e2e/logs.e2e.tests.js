'use strict';

describe('Logs E2E Tests:', function () {
  describe('Test Logs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/logs');
      expect(element.all(by.repeater('log in logs')).count()).toEqual(0);
    });
  });
});
