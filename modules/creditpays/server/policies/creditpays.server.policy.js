'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Creditpays Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/creditpays',
      permissions: '*'
    }, {
      resources: '/api/creditpays/:creditpayId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/creditpays',
      permissions: ['get', 'post']
    }, {
      resources: '/api/creditpays/:creditpayId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/creditpays',
      permissions: ['get']
    }, {
      resources: '/api/creditpays/:creditpayId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Creditpays Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Creditpay is being processed and the current user created it then allow any manipulation
  if (req.creditpay && req.user && req.creditpay.user && req.creditpay.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
