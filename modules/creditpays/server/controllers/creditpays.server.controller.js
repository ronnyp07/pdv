'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Creditpays = mongoose.model('Creditpay'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Creditpays
 */
 exports.create = function(req, res) {
  var creditpay = new Creditpays(req.body);
  creditpay.createdUser = req.user;

  creditpay.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(creditpay);
    }
  });
};

/**
 * Show the current Creditpays
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var creditpay = req.creditpay ? req.creditpay.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  creditpay.isCurrentUserOwner = req.user && creditpay.user && creditpay.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(creditpay);
};

/**
 * Update a Creditpays
 */
 exports.update = function(req, res) {
  var creditpay = req.creditpay ;

  creditpay = _.extend(creditpay , req.body);

  creditpay.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(creditpay);
    }
  });
};

/**
 * Delete an Creditpays
 */
 exports.delete = function(req, res) {
  var creditpay = req.creditpay ;

  creditpay.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(creditpay);
    }
  });
};

/**
 * List of Creditpayss
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
     greaterThanEqual = {fecha_creditpay: search.startDate};
     lessThanEqual = {fecha_creditpay: search.endDate};
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

Creditpays
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
 * Creditpays middleware
 */
 exports.creditpayByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Creditpays is invalid'
    });
  }

  Creditpays.findById(id).populate('user', 'displayName').exec(function (err, creditpay) {
    if (err) {
      return next(err);
    } else if (!creditpay) {
      return res.status(404).send({
        message: 'No Creditpays with that identifier has been found'
      });
    }
    req.creditpay = creditpay;
    next();
  });
};
