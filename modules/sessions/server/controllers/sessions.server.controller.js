'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Session = mongoose.model('Cajaturno'),
 socket = require('socket.io'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Session
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var session = new Session(req.body),
      socket = req.app.get('socketio');
  // Configurar la propiedad 'creador' del Parametro
  session.createdUser = req.user;
  // Intentar salvar el artículo
  session.save(function(err) {
    if (err) {
      console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // socket.sockets.emit('sessionInserted', session);
      // Enviar una representación JSON del artículo
      res.json(session);
    }
  });
};

/**
 * Show the current session
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var session = req.session ? req.session.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  session.isCurrentUserOwner = req.user && session.user && session.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(session);
};

/**
 * Update a Session
 */
 exports.update = function(req, res) {
  var session = req.session ;

  session = _.extend(session , req.body);

  session.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(session);
    }
  });
};

/**
 * Delete an Session
 */
 exports.delete = function(req, res) {
  var session = req.session ;
  console.log(session._id);
  session.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Session.find({ancestors: session._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(session);
    }
  });
};

/**
 * List of Sessions
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Session middleware
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

  Session
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

exports.sessionList = function(req, res) {
    Session
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
 * Session middleware
 */
 exports.getfilterSession = function(req, res){

  Session
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Session){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Session);
    }
  });
};

exports.getMulFilter = function(req, res){
   var query = {};
    if(req.body.seessionId){
      query = {session: req.body.seessionId, inUse: true};
    }else if(req.body.user){
        query = {createdUser: req.body.user, inUse: true};
    }else{
        query = {};
    }
    // {_id: {$regex: req.body.id,  $options: '-i' }}

  Session
  .find(query).exec(function(err, Session){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Session);
    }
  });
};

/**
 * Session middleware
 */
 exports.sessionByID = function(req, res, next, id) {
  Session.findById(id).populate('user', 'displayName').exec(function (err, session) {
    if (err) {
      return next(err);
    } else if (!session) {
      return res.status(404).send({
        message: 'No Session with that identifier has been found'
      });
    }
    req.session = session;
    next();
  });
};
