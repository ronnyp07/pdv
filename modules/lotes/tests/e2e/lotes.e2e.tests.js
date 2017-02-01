'use strict';

describe('Lotes E2E Tests:', function () {
  describe('Test Lotes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/lotes');
      expect(element.all(by.repeater('lote in lotes')).count()).toEqual(0);
    });
  });
});
