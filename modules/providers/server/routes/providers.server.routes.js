'use strict';

/**
 * Module dependencies
 */
var providersPolicy = require('../policies/providers.server.policy'),
  providers = require('../controllers/providers.server.controller');

module.exports = function(app) {
  // Providers Routes
  app.route('/api/providers')
    .get(providers.list)
    .post(providers.create);

  app.route('/api/providers/:providerId')
    .get(providers.read)
    .put(providers.update)
    .delete(providers.delete);

  app.route('/api/providerList')
    .post(providers.providerList);

  // Finish by binding the Provider middleware
  app.param('providerId', providers.providerByID);
};
