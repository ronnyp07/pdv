'use strict';

/**
 * Module dependencies
 */
var inventariosPolicy = require('../policies/inventarios.server.policy'),
  inventarios = require('../controllers/inventarios.server.controller');

module.exports = function(app) {
  // Inventarios Routes
  app.route('/api/inventarios').all(inventariosPolicy.isAllowed)
    .get(inventarios.list)
    .post(inventarios.create);

  app.route('/api/getMaxInventario')
   .post(inventarios.getMaxInventario);

  app.route('/api/inventarios/:inventarioId').all(inventariosPolicy.isAllowed)
    .get(inventarios.read)
    .put(inventarios.update)
    .delete(inventarios.delete);

  // Finish by binding the Inventario middleware
  app.param('inventarioId', inventarios.inventarioByID);
};
