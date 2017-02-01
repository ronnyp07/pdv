'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 fs = require('fs'),
 mongoose = require('mongoose'),
 Ncf = mongoose.model('Ncf'),
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
      message = 'Este ncfo ya existe';
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
 * Show the current ncf
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ncf = req.ncf ? req.ncf.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ncf.isCurrentUserOwner = req.user && ncf.user && ncf.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(ncf);
};

/**
 * Update a Ncf
 */
 exports.update = function(req, res) {
  var ncf = req.ncf ;
  ncf = _.extend(ncf , req.body);

  ncf.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ncf);
    }
  });
};

/**
 * Delete an Ncf
 */
 exports.delete = function(req, res) {
  var ncf = req.ncf ;
  ncf.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Ncf.find({ancestors: ncf._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(ncf);
    }
  });
};

/**
 * List of Ncfs
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Ncf middleware
 */
 exports.list = function(req, res) {
  var count = req.query.count || 15;
  var page = req.query.page || 1;
  var query = {};
  if (req.query.search){
    var search = JSON.parse(req.query.search);
    if(search.sucursalId || search.noNcf || search.productId){
      query = {
         noNcf:{$regex: search.noNcf,  $options: '-i' },
         sucursalId: search.sucursalId,
         productId: search.productId,
         isActive: true
       };
     }
   }

  var pagination = {
    start : (page - 1) * count,
    count : count
  };

  var filter = {
    filters: {
      mandatory: {
        query
      }
    }
  };

  // var sort = {
  //   sort: {
  //     desc: 'name',
  //   }
  // };

  Ncf
  .find({isActive: true})
  .filter(filter)
  //.order(sort)
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

/**
  Created By: Ronny Morel
  Created Date: 7/14/2016
 * Ncf middleware
 */

 exports.getfilterNcf = function(req, res){
  var contains = {};
   console.log(req.query);
    if(req.query.sucursalId){
      contains = {
         sucursalId: req.query.sucursalId,
         isActive: true
       };
   }
     console.log(contains);
  var filter = {
    filters: {
      mandatory: {
        contains
      }
    }
  };

  Ncf
  .find()
  .filter(filter)
  .exec(function(err, Ncf){
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Ncf);
    }
  });
};

exports.getfilterByCategoria = function(req, res){
  Ncf
  .find({ category: { $in: [req.body.categories] }}).exec(function(err, Ncf){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Ncf);
    }
  });
};


/**
 * Ncf middleware
 */
 exports.ncfByID = function(req, res, next, id) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Ncf is invalid'
  //   });
  // }

  Ncf.findById(id).populate('user', 'displayName').exec(function (err, ncf) {
    if (err) {
      return next(err);
    } else if (!ncf) {
      return res.status(404).send({
        message: 'No Ncf with that identifier has been found'
      });
    }
    req.ncf = ncf;
    next();
  });
};

/**
 * Create a Ncf
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var ncf = new Ncf(req.body);
  // // Configurar la propiedad 'creador' del Parametro
  ncf.craetedUser = req.user._id;

   ncf.save(function(err) {
      if (err) {

        console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(ncf);
        }
      });
 };


/**
 * Ncf middleware
 */
 exports.ncfFilter = function(req, res) {
  Ncf.find({$and: [ {isActive: true, sucursalId: req.body.sucursalId },  { $or: [ { noNcf: {$regex: req.body.noNcf,  $options: '-i'}}, {productId: req.body.productId}]} ]})
  .populate('user', 'promotionItems.ncf')
  .exec(function (err, ncf) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
     res.jsonp(ncf);
 }
});
};

exports.getPosNcf = function(req, res) {
  Ncf.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.ncf')
  .exec(function (err, ncf) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      // console.log(req.body.categories);
      _.forEach(ncf, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(ncf);
    }
  }
});
};



exports.getNcfBySucursal = function(req, res) {
  Ncf.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.ncf')
  .exec(function (err, ncf) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      // console.log(req.body.categories);
      _.forEach(ncf, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(ncf);
    }
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
