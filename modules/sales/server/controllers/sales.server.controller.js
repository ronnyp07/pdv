'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Sales = mongoose.model('Sales'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Sales
 */
 exports.create = function(req, res) {
  var sale = new Sales(req.body);
  sale.createdUser = req.user;

  sale.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sale);
    }
  });
};

/**
 * Show the current Sales
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sale = req.sale ? req.sale.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sale.isCurrentUserOwner = req.user && sale.user && sale.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(sale);
};

/**
 * Update a Sales
 */
 exports.update = function(req, res) {
  var sale = req.sale ;

  sale = _.extend(sale , req.body);

  sale.save(function(err) {
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
 * Delete an Sales
 */
 exports.delete = function(req, res) {
  var sale = req.sale ;

  sale.remove(function(err) {
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
 * List of Saless
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
     greaterThanEqual = {fecha_sale: search.startDate};
     lessThanEqual = {fecha_sale: search.endDate};
     if(search.customer && search.sucursalId){
      contains = {
        sucursalId : search.sucursalId,
        customer: search.customer,
        status: search.status
       };
     }else if(search.customer && !search.sucursalId){
      contains = {
        customer: search.customer,
        status: search.status
       };
     }
     else if(!search.customer && search.sucursalId){
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

Sales
.find()
.filter(filter)
  // .order(sort)
  .populate('customer')
  .populate('sucursalId')
  .populate('session')
  .populate('caja')
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

exports.salesList = function(req, res) {
    var query = {},
        status = req.body.status ? req.body.status : null;

   if(req.body.session && !req.body.status){
      query = {session: req.body.session};
    }else if(req.body.session && req.body.status){
      query = {status: status, session: req.body.session};
    }else{
      query = {};
    }

    Sales
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
 * Sales middleware
 */
 exports.saleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sales is invalid'
    });
  }

  Sales.findById(id).populate('user', 'displayName').exec(function (err, sale) {
    if (err) {
      return next(err);
    } else if (!sale) {
      return res.status(404).send({
        message: 'No Sales with that identifier has been found'
      });
    }
    req.sale = sale;
    next();
  });
};
