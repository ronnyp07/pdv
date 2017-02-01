'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Provider = mongoose.model('Providers'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Provider
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var provider = new Provider(req.body);
  // Configurar la propiedad 'creador' del Parametro
  provider.createdUser = req.user;
  // Intentar salvar el artículo
  provider.save(function(err) {
    if (err) {
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Enviar una representación JSON del artículo
      res.json(provider);
    }
  });
};

/**
 * Show the current provider
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var provider = req.provider ? req.provider.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  provider.isCurrentUserOwner = req.user && provider.user && provider.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(provider);
};

/**
 * Update a Provider
 */
 exports.update = function(req, res) {
  var provider = req.provider ;

  provider = _.extend(provider , req.body);

  provider.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(provider);
    }
  });
};

/**
 * Delete an Provider
 */
 exports.delete = function(req, res) {
  var provider = req.provider ;
  console.log(provider._id);
  provider.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Provider.find({ancestors: provider._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(provider);
    }
  });
};

/**
 * List of Providers
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Provider middleware
 */
 exports.list = function(req, res) {

  var count = req.query.count || 25;
  var page = req.query.page || 1;

  var pagination = {
    start : (page - 1) * count,
    count : count
  };

  var filter = {
         filters: {
            field: ['name'],
               mandatory: {
              contains: req.query.filter
      }
    }
  };

  var sort = {
    sort: {
      desc: 'parent',
    }
  };

  Provider
  .find()
  .filter(filter)
  .order({'parent': -1})
  .page(pagination, function(err, parameter){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(parameter);
    }
  });
};

exports.providerList = function(req, res) {
    Provider
    .find({isActive: true})
    .sort('name')
    .exec(function(err, patient){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(patient);
    }
    });
};

/**
  Created By: Ronny Morel
  Created Date: 7/14/2016
 * Provider middleware
 */
 exports.getfilterProvider = function(req, res){
  Provider
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Provider){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Provider);
    }
  });
};

/**
 * Provider middleware
 */
 exports.providerByID = function(req, res, next, id) {
  Provider.findById(id).populate('user', 'displayName').exec(function (err, provider) {
    if (err) {
      return next(err);
    } else if (!provider) {
      return res.status(404).send({
        message: 'No Provider with that identifier has been found'
      });
    }
    req.provider = provider;
    next();
  });
};
