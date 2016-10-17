'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
mongoose = require('mongoose'),
Log = mongoose.model('Log');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * update log before logout
 */
exports.setLog = function (req, res, next) {
 var userId = req.session.passport.user;

  Log.find({createdUser:userId, active:true}).exec(function(err, data){
   if(data){
   console.log('passed');
   console.log(data);
   console.log(data[0]);
   data.active = false;
   var log = new Log(data);
   console.log(log);

   // log.update(function(err){
   //  if (err) {
   //    return res.status(400).send({
   //      message: "Error"
   //    });
   //  }
   //  });
   }
 });
  next();
};
/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

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
