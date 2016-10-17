'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Caja = mongoose.model('Cajas'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Caja
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var caja = new Caja(req.body);
  // Configurar la propiedad 'creador' del Parametro
  caja.createdUser = req.user;
  // Intentar salvar el artículo
  caja.save(function(err) {
    if (err) {
      console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Enviar una representación JSON del artículo
      res.json(caja);
    }
  });
};

/**
 * Show the current caja
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var caja = req.caja ? req.caja.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  caja.isCurrentUserOwner = req.user && caja.user && caja.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(caja);
};

/**
 * Update a Caja
 */
 exports.update = function(req, res) {
  var caja = req.caja,
  socket = req.app.get('socketio');

  caja = _.extend(caja , req.body);

  caja.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      socket.sockets.emit('sessionInserted', caja);
      res.jsonp(caja);
    }
  });
};

/**
 * Delete an Caja
 */
 exports.delete = function(req, res) {
  var caja = req.caja ;
  console.log(caja._id);
  caja.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Caja.find({ancestors: caja._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(caja);
    }
  });
};

/**
 * List of Cajas
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Caja middleware
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

  Caja
  .find()
  .filter(filter)
  .order({'parent': -1})
  .populate('sucursalId')
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

exports.cajaList = function(req, res) {
    Caja
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
 * Caja middleware
 */
 exports.getfilterCaja = function(req, res){
  Caja
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Caja){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Caja);
    }
  });
};

/**
 * Caja middleware
 */
 exports.cajaByID = function(req, res, next, id) {
  Caja.findById(id).populate('user', 'displayName').exec(function (err, caja) {
    if (err) {
      return next(err);
    } else if (!caja) {
      return res.status(404).send({
        message: 'No Caja with that identifier has been found'
      });
    }
    req.caja = caja;
    next();
  });
};
