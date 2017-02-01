'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 fs = require('fs'),
 Sucursal = mongoose.model('Sucursal'),
 moment = require('moment'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');




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
      message = 'Esta cuenta ya existe';
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
/**
 * Create a Sucursal
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var sucursal = new Sucursal(req.body);
  sucursal.createdUser = req.user._id;

  if(req.files.file){
   fs.writeFile('./modules/sucursals/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
    if (uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    } else {
      sucursal.picturesURL = 'modules/sucursals/img/uploads/' + req.files.file.name;
      if(req.body.modeOn === 'update'){
       Sucursal.findById(req.body._id).exec(function(err, sucursal){
        sucursal = _.extend(sucursal , req.body);
        sucursal.picturesURL = 'modules/sucursals/img/uploads/' + req.files.file.name;
        sucursal.save(function(err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(sucursal);
          }
        });
      });
     }else{
      sucursal.save(function(err) {
        if (err) {

          console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(sucursal);
        }
      });
    }
  }
});
 }else{
   sucursal.save(function(err) {
    if (err) {

      console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(sucursal);
        }
      });
 }
};


/**
 * Show the current Sucursal
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sucursal = req.sucursal ? req.sucursal.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sucursal.isCurrentUserOwner = req.user && sucursal.user && sucursal.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(sucursal);
};

/**
 * Update a Sucursal
 */
 exports.update = function(req, res) {
  var sucursal = req.sucursal ;

  sucursal = _.extend(sucursal , req.body);

  sucursal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sucursal);
    }
  });
};

/**
 * Delete an Sucursal
 */
 exports.delete = function(req, res) {
  var sucursal = req.sucursal ;

  sucursal.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sucursal);
    }
  });
};


exports.getList = function(req, res) {
    var query = {};
    if(req.query.companyId){
       query = {companyId: req.query.companyId};
    }

    Sucursal
    .find(query)
    .exec(function(err, sucursal){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sucursal);
    }
    });
};


/**
 * List of Sucursals
 */
 exports.list = function(req, res) {
   var count = req.query.count || 25;
   var page = req.query.page || 1;
   // var search = JSON.parse(req.query.search);
   var pagination = {
    start : (page - 1) * count,
    count : count
  };

  Sucursal
  .find()
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
 * Sucursal middleware
 */
 exports.sucursalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sucursal is invalid'
    });
  }

  Sucursal.findById(id).populate('user', 'displayName').exec(function (err, sucursal) {
    if (err) {
      return next(err);
    } else if (!sucursal) {
      return res.status(404).send({
        message: 'No Sucursal with that identifier has been found'
      });
    }
    req.sucursal = sucursal;
    next();
  });
};
