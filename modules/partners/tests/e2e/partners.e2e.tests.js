'use strict';

describe('Partners E2E Tests:', function () {
  describe('Test Partners page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/partners');
      expect(element.all(by.repeater('partner in partners')).count()).toEqual(0);
    });
  });
});
