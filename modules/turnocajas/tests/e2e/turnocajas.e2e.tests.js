'use strict';

describe('Turnocajas E2E Tests:', function () {
  describe('Test Turnocajas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/turnocajas');
      expect(element.all(by.repeater('turnocaja in turnocajas')).count()).toEqual(0);
    });
  });
});
