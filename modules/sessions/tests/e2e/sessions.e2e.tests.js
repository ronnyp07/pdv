'use strict';

describe('Sessions E2E Tests:', function () {
  describe('Test Sessions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sessions');
      expect(element.all(by.repeater('session in sessions')).count()).toEqual(0);
    });
  });
});
