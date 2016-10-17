'use strict';

/**
 * Module dependencies
 */
var comprasPolicy = require('../policies/compras.server.policy'),
  compras = require('../controllers/compras.server.controller');

module.exports = function(app) {
  // Compras Routes
  app.route('/api/compras').all(comprasPolicy.isAllowed)
    .get(compras.list)
    .post(compras.create);

  app.route('/api/compras/:compraId').all(comprasPolicy.isAllowed)
    .get(compras.read)
    .put(compras.update)
    .delete(compras.delete);

  // Finish by binding the Compra middleware
  app.param('compraId', compras.compraByID);
};
