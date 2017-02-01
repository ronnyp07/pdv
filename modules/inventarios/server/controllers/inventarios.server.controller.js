'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 fs = require('fs'),
 mongoose = require('mongoose'),
 Inventario = mongoose.model('Inventario'),
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
      message = 'Este inventarioo ya existe';
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
 * Show the current inventario
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var inventario = req.inventario ? req.inventario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  inventario.isCurrentUserOwner = req.user && inventario.user && inventario.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(inventario);
};

/**
 * Update a Inventario
 */
 exports.update = function(req, res) {
  var inventario = req.inventario ;
  inventario.updatedDate = Date.now();
  inventario.updatedUser = req.user._id;
  inventario.sucursalId = req.body.sucursalId,
  inventario.listinventoryPromotion = req.body.listinventoryPromotion,
  inventario.isValid =req.body.isValid,
  inventario.status =  req.body.status;

  inventario.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventario);
    }
  });
};

/**
 * Delete an Inventario
 */
 exports.delete = function(req, res) {
  var inventario = req.inventario ;
  inventario.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Inventario.find({ancestors: inventario._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(inventario);
    }
  });
};

/**
 * List of Inventarios
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Inventario middleware
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
      asc: 'status',
    }
  };

  Inventario
  .find()
  .filter(filter)
  .order(sort)
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

/**
  Created By: Ronny Morel
  Created Date: 7/14/2016
 * Inventario middleware
 */

 exports.getfilterInventario = function(req, res){
  Inventario
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(15).exec(function(err, Inventario){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Inventario);
    }
  });
};

/**
 *Inventario middleware
 Created By: Ronny Morel
 Created Date: 8/19/2016
 Description: Get the last inventory with status active.
 Param: @sucursalId
 */
exports.getMaxInventario = function(req, res){
  Inventario
  .find({sucursalId: req.body.sucursalId, status: 'Activo'}).sort({createdDate: -1}).limit(1).exec(function(err, inventario){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inventario);
    }
  });
};


/**
 * Inventario middleware
 */
 exports.inventarioByID = function(req, res, next, id) {
  Inventario.findById(id).populate('user', 'displayName').exec(function (err, inventario) {
    if (err) {
      return next(err);
    } else if (!inventario) {
      return res.status(404).send({
        message: 'No Inventario with that identifier has been found'
      });
    }
    req.inventario = inventario;
    next();
  });
};

/**
 * Create a Inventario
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var inventario = new Inventario(req.body);
  // // Configurar la propiedad 'creador' del Parametro
  inventario.craetedUser = req.user._id;

   inventario.save(function(err) {
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
      res.json(inventario);
    }
  });
};


/**
 * Inventario middleware
 */
 exports.inventarioFilter = function(req, res) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Inventario is invalid'
  //   });
  // }

  Inventario.find({ $or: [ { name: {$regex: req.body.bardCode,  $options: '-i'}}, {bardCode: req.body.bardCode } ] })
  .populate('user', 'promotionItems.inventario')
  .exec(function (err, inventario) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.jsonp(inventario);
  }
});
};


exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;

  if (user) {
    fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = 'modules/users/img/profile/uploads/' + req.files.file.name;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
