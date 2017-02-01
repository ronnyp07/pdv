'use strict';

/**
 * Module dependencies
 */
var lotesPolicy = require('../policies/lotes.server.policy'),
  lotes = require('../controllers/lotes.server.controller');

module.exports = function(app) {
  // Lotes Routes
  app.route('/api/lotes')
    .get(lotes.list)
    .post(lotes.create);

  app.route('/api/lotes/:loteId')
    .get(lotes.read)
    .put(lotes.update)
    .delete(lotes.delete);

  app.route('/api/getfilterLote')
  .get(lotes.getfilterLote);

  // Finish by binding the Lote middleware
  app.param('loteId', lotes.loteByID);
};
