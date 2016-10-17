'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Turnocaja = mongoose.model('Turnocaja'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Turnocaja
 */
exports.create = function(req, res) {
  var turnocaja = new Turnocaja(req.body);
  turnocaja.user = req.user;

  turnocaja.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(turnocaja);
    }
  });
};

/**
 * Show the current Turnocaja
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var turnocaja = req.turnocaja ? req.turnocaja.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  turnocaja.isCurrentUserOwner = req.user && turnocaja.user && turnocaja.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(turnocaja);
};

/**
 * Update a Turnocaja
 */
exports.update = function(req, res) {
  var turnocaja = req.turnocaja ;

  turnocaja = _.extend(turnocaja , req.body);

  turnocaja.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(turnocaja);
    }
  });
};

/**
 * Delete an Turnocaja
 */
exports.delete = function(req, res) {
  var turnocaja = req.turnocaja ;

  turnocaja.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(turnocaja);
    }
  });
};

/**
 * List of Turnocajas
 */
exports.list = function(req, res) { 
  Turnocaja.find().sort('-created').populate('user', 'displayName').exec(function(err, turnocajas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(turnocajas);
    }
  });
};

/**
 * Turnocaja middleware
 */
exports.turnocajaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Turnocaja is invalid'
    });
  }

  Turnocaja.findById(id).populate('user', 'displayName').exec(function (err, turnocaja) {
    if (err) {
      return next(err);
    } else if (!turnocaja) {
      return res.status(404).send({
        message: 'No Turnocaja with that identifier has been found'
      });
    }
    req.turnocaja = turnocaja;
    next();
  });
};
