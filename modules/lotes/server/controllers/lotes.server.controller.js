'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 fs = require('fs'),
 mongoose = require('mongoose'),
 Lote = mongoose.model('Lote'),
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
      message = 'Este loteo ya existe';
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
 * Show the current lote
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var lote = req.lote ? req.lote.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  lote.isCurrentUserOwner = req.user && lote.user && lote.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(lote);
};

/**
 * Update a Lote
 */
 exports.update = function(req, res) {
  var lote = req.lote ;
  lote = _.extend(lote , req.body);

  lote.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lote);
    }
  });
};

/**
 * Delete an Lote
 */
 exports.delete = function(req, res) {
  var lote = req.lote ;
  lote.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Lote.find({ancestors: lote._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(lote);
    }
  });
};

/**
 * List of Lotes
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Lote middleware
 */
 exports.list = function(req, res) {
  var count = req.query.count || 15;
  var page = req.query.page || 1;
  var query = {};
  if (req.query.search){
    var search = JSON.parse(req.query.search);
    if(search.sucursalId || search.noLote || search.productId){
      query = {
         noLote:{$regex: search.noLote,  $options: '-i' },
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

  var sort = {
    sort: {
      desc: 'name',
    }
  };

  Lote
  .find({isActive: true})
  .filter(filter)
  .order(sort)
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
 * Lote middleware
 */

 exports.getfilterLote = function(req, res){
  var contains = {};
    //var search = JSON.parse(req.query.search);
    if(req.query.sucursalId || req.query.noLote || req.query.productId){
      contains = {
         noLote: req.query.noLote ? {$regex: req.query.noLote,  $options: '-i' } : '',
         sucursalId: req.query.sucursalId,
         productId: req.query.productId,
         isActive: true
       };

      // query = {
      //   isActive: true,
      //   sucursalId : search.sucursalId ? search.sucursalId : '',
      //   name: search.name ? search.name : '',
      //   category: search.category ? search.category : ''
      // };
   }
 var filter = {
    filters: {
      mandatory: {
        contains
      }
    }
  };

  Lote
  .find()
  .filter(filter)
  .exec(function(err, Lote){
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Lote);
    }
  });
};

exports.getfilterByCategoria = function(req, res){
  Lote
  .find({ category: { $in: [req.body.categories] }}).exec(function(err, Lote){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Lote);
    }
  });
};


/**
 * Lote middleware
 */
 exports.loteByID = function(req, res, next, id) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Lote is invalid'
  //   });
  // }

  Lote.findById(id).populate('user', 'displayName').exec(function (err, lote) {
    if (err) {
      return next(err);
    } else if (!lote) {
      return res.status(404).send({
        message: 'No Lote with that identifier has been found'
      });
    }
    req.lote = lote;
    next();
  });
};

/**
 * Create a Lote
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var lote = new Lote(req.body);
  // // Configurar la propiedad 'creador' del Parametro
  lote.craetedUser = req.user._id;

   lote.save(function(err) {
      if (err) {

        console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(lote);
        }
      });
 };


/**
 * Lote middleware
 */
 exports.loteFilter = function(req, res) {
  Lote.find({$and: [ {isActive: true, sucursalId: req.body.sucursalId },  { $or: [ { noLote: {$regex: req.body.noLote,  $options: '-i'}}, {productId: req.body.productId}]} ]})
  .populate('user', 'promotionItems.lote')
  .exec(function (err, lote) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
     res.jsonp(lote);
 }
});
};

exports.getPosLote = function(req, res) {
  Lote.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.lote')
  .exec(function (err, lote) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      // console.log(req.body.categories);
      _.forEach(lote, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(lote);
    }
  }
});
};



exports.getLoteBySucursal = function(req, res) {
  Lote.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.lote')
  .exec(function (err, lote) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      // console.log(req.body.categories);
      _.forEach(lote, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(lote);
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
