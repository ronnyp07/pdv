'use strict';

/**
 * Module dependencies
 */
var cajasPolicy = require('../policies/cajas.server.policy'),
  cajas = require('../controllers/cajas.server.controller');

module.exports = function(app) {
  // Cajas Routes
  app.route('/api/cajas')
    .get(cajas.list)
    .post(cajas.create);

  app.route('/api/cajas/:cajaId').all(cajasPolicy.isAllowed)
    .get(cajas.read)
    .put(cajas.update)
    .delete(cajas.delete);

  // Finish by binding the Caja middleware
  app.param('cajaId', cajas.cajaByID);
};
