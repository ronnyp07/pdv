'use strict';

/**
 * Module dependencies
 */
var sessionsPolicy = require('../policies/sessions.server.policy'),
  sessions = require('../controllers/sessions.server.controller');

module.exports = function(app) {
  // Sessions Routes
  app.route('/api/sessions').all(sessionsPolicy.isAllowed)
    .get(sessions.list)
    .post(sessions.create);

  app.route('/api/sessions/:sessionId').all(sessionsPolicy.isAllowed)
    .get(sessions.read)
    .put(sessions.update)
    .delete(sessions.delete);

  app.route('/api/getMulFilter')
    .post(sessions.getMulFilter);

  // Finish by binding the Session middleware
  app.param('sessionId', sessions.sessionByID);
};
