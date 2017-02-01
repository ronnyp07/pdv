'use strict';

/**
 * Module dependencies
 */
var cajaturnosPolicy = require('../policies/cajaturnos.server.policy'),
  cajaturnos = require('../controllers/cajaturnos.server.controller');

module.exports = function(app) {
  // Cierreturnos Routes
  app.route('/api/cajaturnos').all(cajaturnosPolicy.isAllowed)
    .get(cajaturnos.list)
    .post(cajaturnos.create);

  app.route('/api/cajaturnos/:cajaturnoId').all(cajaturnosPolicy.isAllowed)
    .get(cajaturnos.read)
    .put(cajaturnos.update)
    .delete(cajaturnos.delete);

  app.route('/api/getMulFilter')
    .post(cajaturnos.getMulFilter);


  // Finish by binding the Cierreturno middleware
  app.param('cajaturnoId', cajaturnos.cajaturnoByID);
};
