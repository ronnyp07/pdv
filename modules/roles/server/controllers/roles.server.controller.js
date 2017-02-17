'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Role = mongoose.model('Role'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Role
 */
exports.create = function(req, res) {
  var role = new Role(req.body);
  role.user = req.user;

  role.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(role);
    }
  });
};

/**
 * Show the current Role
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var role = req.role ? req.role.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  role.isCurrentUserOwner = req.user && role.user && role.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(role);
};

/**
 * Update a Role
 */
exports.update = function(req, res) {
  var role = req.role ;

  role = _.extend(role , req.body);

  role.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(role);
    }
  });
};

/**
 * Delete an Role
 */
exports.delete = function(req, res) {
  var role = req.role ;

  role.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(role);
    }
  });
};

/**
 * List of Roles
 */
exports.list = function(req, res) { 
  Role.find().sort('-created').populate('user', 'displayName').exec(function(err, roles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(roles);
    }
  });
};

/**
 * Role middleware
 */
exports.roleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Role is invalid'
    });
  }

  Role.findById(id).populate('user', 'displayName').exec(function (err, role) {
    if (err) {
      return next(err);
    } else if (!role) {
      return res.status(404).send({
        message: 'No Role with that identifier has been found'
      });
    }
    req.role = role;
    next();
  });
};
