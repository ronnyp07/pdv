'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Customer = mongoose.model('Customer'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Customer
 */
 exports.create = function(req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;

  customer.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
 exports.update = function(req, res) {
  var customer = req.customer ;

  customer = _.extend(customer , req.body);

  customer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
 exports.delete = function(req, res) {
  var customer = req.customer ;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);

    }
  });
};

/**
 * List of Customers
 */
 exports.list = function(req, res) {
  var count = req.query.count || 5;
  var page = req.query.page || 1;
  var contains = {};
  if (req.query.search){
    contains = {
        name: req.query.search ? req.query.search: ''
      };
    // }else{
    //   contains = {
    //     sucursalId : ''
    //   };
    // }
  };

  console.log(contains);

  var filter = {
    filters: {
      mandatory: {
        contains
      }
    }
  };

  var pagination = {
    start : (page - 1) * count,
    count : count
  };

  Customer
  .find()
  .filter(filter)
  .page(pagination, function(err, customer){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
       console.log(customer);
      res.jsonp(customer);
    }
  });
};

exports.listPagination = function(req, res) {
  console.log('hit');
  var count = req.query.count || 5;
  var page = req.query.page || 1;

  var filter = {
    filters: {
      field: ['name'],
      mandatory: {
        contains: req.query.filter
      }
    }
  };

  var pagination = {
    start : (page - 1) * count,
    count : count
  };

  var sort = {
    sort: {
      desc: '_id'
    }
  };

  Customer
  .find()
  .filter(filter)
  .order(sort)
    // .populate('pais')
    // .populate('ciudad')
    // .populate('sector')
    // .populate('clientes')
    // .populate('locations')
    .page(pagination, function(err, customer){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(customer);
      }
    });
  };

/**
 * Customer middleware
 */
 exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
