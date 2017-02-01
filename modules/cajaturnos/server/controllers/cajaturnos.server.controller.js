'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Cajaturno = mongoose.model('Cajaturno'),
 socket = require('socket.io'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Cajaturno
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var cajaturno = new Cajaturno(req.body),
  socket = req.app.get('socketio');
  // Configurar la propiedad 'creador' del Parametro
  cajaturno.createdUser = req.user;
  // Intentar salvar el artículo
  cajaturno.save(function(err) {
    if (err) {
      console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // socket.sockets.emit('cajaturnoInserted', cajaturno);
      // Enviar una representación JSON del artículo
      res.json(cajaturno);
    }
  });
};

/**
 * Show the current cajaturno
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cajaturno = req.cajaturno ? req.cajaturno.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cajaturno.isCurrentUserOwner = req.user && cajaturno.user && cajaturno.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(cajaturno);
};

/**
 * Update a Cajaturno
 */
 exports.update = function(req, res) {
  var cajaturno = req.cajaturno;
  // cajaturno.inUse = req.body.inUse;
  // cajaturno.cuadreCierre =  req.body.cuadreCierre;
  // cajaturno.updatedDate =  Date.now;

  //console.log(req.cajaturno);
  cajaturno = _.extend(cajaturno , req.body);

  cajaturno.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cajaturno);
    }
  });
};

/**
 * Delete an Cajaturno
 */
 exports.delete = function(req, res) {
  var cajaturno = req.cajaturno ;
  console.log(cajaturno._id);
  cajaturno.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Cajaturno.find({ancestors: cajaturno._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(cajaturno);
    }
  });
};

/**
 * List of Cajaturnos
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Cajaturno middleware
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

Cajaturno
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

exports.cajaturnoList = function(req, res) {
  Cajaturno
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
 * Cajaturno middleware
 */
 exports.getfilterCajaturno = function(req, res){

  Cajaturno
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Cajaturno){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Cajaturno);
    }
  });
};

exports.getMulFilter = function(req, res){
 var query = {};
 if(req.body.seessionId){
  query = {cajaturno: req.body.seessionId, inUse: true};
}else if(req.body.user){
  query = {createdUser: req.body.user, inUse: true};
}else{
  query = {};
}
    // {_id: {$regex: req.body.id,  $options: '-i' }}

    Cajaturno
    .find(query).exec(function(err, Cajaturno){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(Cajaturno);
      }
    });
  };

/**
 * Cajaturno middleware
 */
 exports.cajaturnoByID = function(req, res, next, id) {
  Cajaturno.findById(id).populate('user', 'displayName').exec(function (err, cajaturno) {
    if (err) {
      return next(err);
    } else if (!cajaturno) {
      return res.status(404).send({
        message: 'No Cajaturno with that identifier has been found'
      });
    }
    req.cajaturno = cajaturno;
    next();
  });
};
