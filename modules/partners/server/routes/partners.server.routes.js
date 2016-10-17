'use strict';

/**
 * Module dependencies
 */
var partnersPolicy = require('../policies/partners.server.policy'),
  partners = require('../controllers/partners.server.controller');

module.exports = function(app) {
  // Partners Routes
  app.route('/api/partners').all(partnersPolicy.isAllowed)
    .get(partners.list)
    .post(partners.create);

  app.route('/api/partners/:partnerId').all(partnersPolicy.isAllowed)
    .get(partners.read)
    .put(partners.update)
    .delete(partners.delete);

  // Finish by binding the Partner middleware
  app.param('partnerId', partners.partnerByID);
};
