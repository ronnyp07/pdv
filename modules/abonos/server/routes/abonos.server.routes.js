'use strict';

/**
 * Module dependencies
 */
var abonosPolicy = require('../policies/abonos.server.policy'),
  abonos = require('../controllers/abonos.server.controller');

module.exports = function(app) {
  // Abonos Routes
  app.route('/api/abonos').all(abonosPolicy.isAllowed)
    .get(abonos.list)
    .post(abonos.create);

  app.route('/api/abonos/:abonoId').all(abonosPolicy.isAllowed)
    .get(abonos.read)
    .put(abonos.update)
    .delete(abonos.delete);

  // Finish by binding the Abono middleware
  app.param('abonoId', abonos.abonoByID);
};
