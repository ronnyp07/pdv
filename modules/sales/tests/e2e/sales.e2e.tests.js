'use strict';

describe('Sales E2E Tests:', function () {
  describe('Test Sales page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sales');
      expect(element.all(by.repeater('sale in sales')).count()).toEqual(0);
    });
  });
});
