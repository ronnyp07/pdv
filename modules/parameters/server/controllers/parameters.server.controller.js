'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Parameter = mongoose.model('Parameters'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Parameter
 */

 // Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Este parametro ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};

exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var parameter = new Parameter(req.body);
  // Configurar la propiedad 'creador' del Parametro
  parameter.createdUser = req.user;
  parameter._id = req.body.name;
  parameter.name = req.body.name;
  // Intentar salvar el artículo
  parameter.save(function(err) {
    if (err) {
      if(err.code === 11000){
              return res.status(400).send({
                message: 'Parametro ya existe'
          });
            }else {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }
    }  else {
      // Enviar una representación JSON del artículo
      res.json(parameter);
    }
  });
};

/**
 * Show the current Parameter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var parameter = req.parameter ? req.parameter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  parameter.isCurrentUserOwner = req.user && parameter.user && parameter.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(parameter);
};

/**
 * Update a Parameter
 */
exports.update = function(req, res) {
  var parameter = req.parameter ;

  parameter = _.extend(parameter , req.body);

  parameter.save(function(err) {
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
 * Delete an Parameter
 */
exports.delete = function(req, res) {
  var parameter = req.parameter ;
  parameter.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Parameter.find({ancestors: parameter._id}).remove(function(err){
        if(err){
            console.log("error when delete dependences");
          }else{
            console.log("remove when delete dependences");
          }

      });
      res.jsonp(parameter);
    }
  });
};

/**
 * List of Parameters
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Parameter middleware
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

     Parameter
    .find()
    .filter(filter)
    .order({'parent': -1})
    .populate('parent')
    .page(pagination, function(err, Parameter){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Parameter);
    }
    });
};

/**
  Created By: Ronny Morel
  Created Date: 7/14/2016
 * Parameter middleware
 */

exports.getfilterParameter = function(req, res){
    Parameter
    .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Parameter){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Parameter);
    }
    });
};

exports.parameterfilterByParent = function(req, res){
  console.log(req.body.param);
  var query;
    if(req.body.param && req.body.id){
     query = {parent: {$regex: req.body.param,  $options: '-i' }, isActive:true,_id: {$regex: req.body.id,  $options: '-i' }};
    }else if (req.body.param && !req.body.id) {
     query = {parent: {$regex: req.body.param,  $options: '-i' }, isActive:true};
    } else {
    query  = {};
    }
    Parameter
    .find(query).exec(function(err, Parameter){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Parameter);
    }
    });
};


exports.parameterfilterByAncestor = function(req, res){
  console.log(req.body.param);
    Parameter
    .find({ancestors: {$regex: req.body.param,  $options: '-i' }, isActive:true}).exec(function(err, Parameter){
      if (err) {
        console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Parameter);
    }
    });
};






/**
 * Parameter middleware
 */
exports.parameterByID = function(req, res, next, id) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Parameter is invalid'
  //   });
  // }
  Parameter.findById(id).populate('user', 'displayName').exec(function (err, parameter) {
    if (err) {
      return next(err);
    } else if (!parameter) {
      return res.status(404).send({
        message: 'No Parameter with that identifier has been found'
      });
    }
    req.parameter = parameter;
    next();
  });
};
