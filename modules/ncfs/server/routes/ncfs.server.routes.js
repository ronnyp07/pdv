'use strict';

/**
 * Module dependencies
 */
var ncfsPolicy = require('../policies/ncfs.server.policy'),
  ncfs = require('../controllers/ncfs.server.controller');

module.exports = function(app) {
  // Ncfs Routes
  app.route('/api/ncfs')
    .get(ncfs.list)
    .post(ncfs.create);

  app.route('/api/ncfs/:ncfId')
    .get(ncfs.read)
    .put(ncfs.update)
    .delete(ncfs.delete);

  app.route('/api/getfilterNcf')
  .get(ncfs.getfilterNcf);

  // Finish by binding the Ncf middleware
  app.param('ncfId', ncfs.ncfByID);
};
