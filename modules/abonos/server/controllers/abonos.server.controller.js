'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Abonos = mongoose.model('Abono'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Abonos
 */
 exports.create = function(req, res) {
  var abono = new Abonos(req.body);
  abono.createdUser = req.user;

  abono.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(abono);
    }
  });
};

/**
 * Show the current Abonos
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var abono = req.abono ? req.abono.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  abono.isCurrentUserOwner = req.user && abono.user && abono.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(abono);
};

/**
 * Update a Abonos
 */
 exports.update = function(req, res) {
  var abono = req.abono ;

  abono = _.extend(abono , req.body);

  abono.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(abono);
    }
  });
};

/**
 * Delete an Abonos
 */
 exports.delete = function(req, res) {
  var abono = req.abono ;

  abono.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(abono);
    }
  });
};

/**
 * List of Abonoss
 */
 exports.list = function(req, res) {
   var count = req.query.count || 25;
   var page = req.query.page || 1;
   // var search = JSON.parse(req.query.search);
   var pagination = {
    start : (page - 1) * count,
    count : count
  };


  var contains = {},
      greaterThanEqual =  {},
      lessThanEqual =  {};

  if (req.query.search){
    var search = JSON.parse(req.query.search);
     greaterThanEqual = {fecha_abono: search.startDate};
     lessThanEqual = {fecha_abono: search.endDate};
     if(search.provider && search.sucursalId){
      contains = {
        sucursalId : search.sucursalId,
        provider: search.provider,
        status: search.status
       };
     }else if(search.provider && !search.sucursalId){
      contains = {
        provider: search.provider,
        status: search.status
       };
     }
     else if(!search.provider && search.sucursalId){
      contains = {
        sucursalId : search.sucursalId,
        status: search.status
       };
     }else{
      contains = {
        status: search.status
       };
     }
    }

console.log(contains);

var filter = {
  filters: {
    mandatory: {
      contains,
      greaterThanEqual,
      lessThanEqual
    }
  }
};

Abonos
.find()
.filter(filter)
  // .order(sort)
  .populate('provider')
  .populate('sucursalId')
  .page(pagination, function(err, parameter){
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(parameter);
    }
  });
};
/**
 * Abonos middleware
 */
 exports.abonoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Abonos is invalid'
    });
  }

  Abonos.findById(id).populate('user', 'displayName').exec(function (err, abono) {
    if (err) {
      return next(err);
    } else if (!abono) {
      return res.status(404).send({
        message: 'No Abonos with that identifier has been found'
      });
    }
    req.abono = abono;
    next();
  });
};
