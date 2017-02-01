'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Compra = mongoose.model('Compra'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Compra
 */
 exports.create = function(req, res) {
  var compra = new Compra(req.body);
  compra.user = req.user;

  compra.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(compra);
    }
  });
};

/**
 * Show the current Compra
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var compra = req.compra ? req.compra.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  compra.isCurrentUserOwner = req.user && compra.user && compra.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(compra);
};

/**
 * Update a Compra
 */
 exports.update = function(req, res) {
  var compra = req.compra ;

  compra = _.extend(compra , req.body);

  compra.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(compra);
    }
  });
};

/**
 * Delete an Compra
 */
 exports.delete = function(req, res) {
  var compra = req.compra ;

  compra.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(compra);
    }
  });
};

/**
 * List of Compras
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
     greaterThanEqual = {fecha_compra: search.startDate};
     lessThanEqual = {fecha_compra: search.endDate};
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

Compra
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
 * Compra middleware
 */
 exports.compraByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Compra is invalid'
    });
  }

  Compra.findById(id).populate('user', 'displayName').exec(function (err, compra) {
    if (err) {
      return next(err);
    } else if (!compra) {
      return res.status(404).send({
        message: 'No Compra with that identifier has been found'
      });
    }
    req.compra = compra;
    next();
  });
};
