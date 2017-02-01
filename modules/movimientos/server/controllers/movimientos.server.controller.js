'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Movimiento = mongoose.model('Movimiento'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Movimiento
 */
 exports.create = function(req, res) {
  var movimiento = new Movimiento(req.body);
  movimiento.createdUser = req.user;

  movimiento.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movimiento);
    }
  });
};

/**
 * Show the current Movimiento
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var movimiento = req.movimiento ? req.movimiento.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  movimiento.isCurrentUserOwner = req.user && movimiento.user && movimiento.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(movimiento);
};

/**
 * Update a Movimiento
 */
 exports.update = function(req, res) {
  var movimiento = req.movimiento ;

  movimiento = _.extend(movimiento , req.body);

  movimiento.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movimiento);
    }
  });
};

/**
 * Delete an Movimiento
 */
 exports.delete = function(req, res) {
  var movimiento = req.movimiento ;

  movimiento.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(movimiento);
    }
  });
};

/**
 * List of Movimientos
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
     greaterThanEqual = {fecha_movimiento: search.startDate};
     lessThanEqual = {fecha_movimiento: search.endDate};
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

var filter = {
  filters: {
    mandatory: {
      contains,
      greaterThanEqual,
      lessThanEqual
    }
  }
};

Movimiento
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

exports.movList = function(req, res) {
    var query = {},
        status = req.body.status ? req.body.status : null;
        query = {session: req.body.cajaturno, isValid: status};
        console.log(req.body);
   // if(req.body.cajaturno && !req.body.status){
   //
   //  }else if(req.body.cajaturno && req.body.status){
   //    query = {isValid: status, session: req.body.cajaturno};
   //  }else{
   //    query = {};
   //  }

    Movimiento
    .find(query)
    .populate('customer')
    .exec(function(err, sale){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sale);
    }
    });
};
/**
 * Movimiento middleware
 */
 exports.movimientoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Movimiento is invalid'
    });
  }

  Movimiento.findById(id).populate('user', 'displayName').exec(function (err, movimiento) {
    if (err) {
      return next(err);
    } else if (!movimiento) {
      return res.status(404).send({
        message: 'No Movimiento with that identifier has been found'
      });
    }
    req.movimiento = movimiento;
    next();
  });
};
