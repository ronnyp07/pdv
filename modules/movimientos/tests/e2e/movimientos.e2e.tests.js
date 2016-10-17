'use strict';

describe('Movimientos E2E Tests:', function () {
  describe('Test Movimientos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/movimientos');
      expect(element.all(by.repeater('movimiento in movimientos')).count()).toEqual(0);
    });
  });
});
