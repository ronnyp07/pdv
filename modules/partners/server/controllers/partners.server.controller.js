'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 fs = require('fs'),
 Partner = mongoose.model('Partner'),
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
 * Create a Partner
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var partner = new Partner(req.body);
  partner.createdUser = req.user._id;

  if(req.files.file){
   fs.writeFile('./modules/partners/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
    if (uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    } else {
      partner.picturesURL = 'modules/partners/img/uploads/' + req.files.file.name;
      if(req.body.modeOn === 'update'){
       console.log('update');
       Partner.findById(req.body._id).exec(function(err, partner){
        partner = _.extend(partner , req.body);
        partner.picturesURL = 'modules/partners/img/uploads/' + req.files.file.name;
        partner.save(function(err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(partner);
          }
        });
      });
     }else{
      partner.save(function(err) {
        if (err) {

          console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(partner);
        }
      });
    }
  }
});
 }else{
   partner.save(function(err) {
    if (err) {

      console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(partner);
        }
      });
 }
};


/**
 * Show the current Partner
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var partner = req.partner ? req.partner.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  partner.isCurrentUserOwner = req.user && partner.user && partner.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(partner);
};

/**
 * Update a Partner
 */
 exports.update = function(req, res) {
  var partner = req.partner ;

  partner = _.extend(partner , req.body);

  partner.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(partner);
    }
  });
};

/**
 * Delete an Partner
 */
 exports.delete = function(req, res) {
  var partner = req.partner ;

  partner.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(partner);
    }
  });
};

/**
 * List of Partners
 */
 exports.list = function(req, res) {
   var count = req.query.count || 25;
   var page = req.query.page || 1;
   // var search = JSON.parse(req.query.search);
   var pagination = {
    start : (page - 1) * count,
    count : count
  };

  Partner
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
 * Partner middleware
 */
 exports.partnerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Partner is invalid'
    });
  }

  Partner.findById(id).populate('user', 'displayName').exec(function (err, partner) {
    if (err) {
      return next(err);
    } else if (!partner) {
      return res.status(404).send({
        message: 'No Partner with that identifier has been found'
      });
    }
    req.partner = partner;
    next();
  });
};
