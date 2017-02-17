'use strict';

describe('Roles E2E Tests:', function () {
  describe('Test Roles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/roles');
      expect(element.all(by.repeater('role in roles')).count()).toEqual(0);
    });
  });
});
