'use strict';

/**
 * Module dependencies
 */
var creditpaysPolicy = require('../policies/creditpays.server.policy'),
  creditpays = require('../controllers/creditpays.server.controller');

module.exports = function(app) {
  // Creditpays Routes
  app.route('/api/creditpays').all(creditpaysPolicy.isAllowed)
    .get(creditpays.list)
    .post(creditpays.create);

  app.route('/api/creditpays/:creditpayId').all(creditpaysPolicy.isAllowed)
    .get(creditpays.read)
    .put(creditpays.update)
    .delete(creditpays.delete);

  // Finish by binding the Creditpay middleware
  app.param('creditpayId', creditpays.creditpayByID);
};
