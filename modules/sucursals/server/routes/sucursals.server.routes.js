'use strict';

/**
 * Module dependencies
 */
var sucursalsPolicy = require('../policies/sucursals.server.policy'),
  sucursals = require('../controllers/sucursals.server.controller');

module.exports = function(app) {
  // Sucursals Routes
  app.route('/api/sucursals').all(sucursalsPolicy.isAllowed)
    .get(sucursals.list)
    .post(sucursals.create);

  app.route('/api/sucursalList')
    .get(sucursals.getList);

  app.route('/api/sucursals/:sucursalId').all(sucursalsPolicy.isAllowed)
    .get(sucursals.read)
    .put(sucursals.update)
    .delete(sucursals.delete);

  // Finish by binding the Sucursal middleware
  app.param('sucursalId', sucursals.sucursalByID);
};
