'use strict';

/**
 * Module dependencies
 */
var parametersPolicy = require('../policies/parameters.server.policy'),
  parameters = require('../controllers/parameters.server.controller');

module.exports = function(app) {
  // Parameters Routes
  app.route('/api/parameters')
    .get(parameters.list)
    .post(parameters.create);

  app.route('/api/parameters/:parameterId')
    .get(parameters.read)
    .put(parameters.update)
    .delete(parameters.delete);

  app.route('/api/parameterfilter')
    .post(parameters.getfilterParameter);

  app.route('/api/parameterfilterByParent')
    .post(parameters.parameterfilterByParent);

  app.route('/api/parameterfilterByAncestor')
    .post(parameters.parameterfilterByAncestor);

  // Finish by binding the Parameter middleware
  app.param('parameterId', parameters.parameterByID);
};
