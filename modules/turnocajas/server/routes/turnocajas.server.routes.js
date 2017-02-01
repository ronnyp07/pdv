'use strict';

/**
 * Module dependencies
 */
var turnocajasPolicy = require('../policies/turnocajas.server.policy'),
  turnocajas = require('../controllers/turnocajas.server.controller');

module.exports = function(app) {
  // Turnocajas Routes
  app.route('/api/turnocajas').all(turnocajasPolicy.isAllowed)
    .get(turnocajas.list)
    .post(turnocajas.create);

  app.route('/api/turnocajas/:turnocajaId').all(turnocajasPolicy.isAllowed)
    .get(turnocajas.read)
    .put(turnocajas.update)
    .delete(turnocajas.delete);

  // Finish by binding the Turnocaja middleware
  app.param('turnocajaId', turnocajas.turnocajaByID);
};
