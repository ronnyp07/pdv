'use strict';

/**
 * Module dependencies
 */
var movimientosPolicy = require('../policies/movimientos.server.policy'),
  movimientos = require('../controllers/movimientos.server.controller');

module.exports = function(app) {
  // Movimientos Routes
  app.route('/api/movimientos').all(movimientosPolicy.isAllowed)
    .get(movimientos.list)
    .post(movimientos.create);

  app.route('/api/movimientos/:movimientoId').all(movimientosPolicy.isAllowed)
    .get(movimientos.read)
    .put(movimientos.update)
    .delete(movimientos.delete);

  app.route('/api/movList')
  .post(movimientos.movList);
  // Finish by binding the Movimiento middleware
  app.param('movimientoId', movimientos.movimientoByID);
};
