'use strict';

/**
 * Module dependencies
 */
var logsPolicy = require('../policies/logs.server.policy'),
  logs = require('../controllers/logs.server.controller');

module.exports = function(app) {
  // Logs Routes
  app.route('/api/logs').all(logsPolicy.isAllowed)
    .get(logs.list)
    .post(logs.create);

  app.route('/api/logs/:logId').all(logsPolicy.isAllowed)
    .get(logs.read)
    .put(logs.update)
    .delete(logs.delete);

  app.route('/api/getLogsByUser')
    .post(logs.getLogByUser);

  // Finish by binding the Log middleware
  app.param('logId', logs.logByID);
};
