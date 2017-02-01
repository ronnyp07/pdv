'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 fs = require('fs'),
 mongoose = require('mongoose'),
 Product = mongoose.model('Products'),
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
      message = 'Este producto ya existe';
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
 * Show the current product
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(product);
};

/**
 * Update a Product
 */
 exports.update = function(req, res) {
  var product = req.product ;
  product = _.extend(product , req.body);

  product.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
 exports.delete = function(req, res) {
  var product = req.product ;
  product.remove(function(err) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Product.find({ancestors: product._id}).remove(function(err){
        if(err){
          console.log("error when delete dependences");
        }else{
          console.log("remove when delete dependences");
        }

      });
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
  Update By: Ronny Morel
  Update Date: 7/14/2016
 * Product middleware
 */
 exports.list = function(req, res) {
  var count = req.query.count || 15;
  var page = req.query.page || 1;
  var contains = {};
  if (req.query.search){
    var search = JSON.parse(req.query.search);
    if(search.sucursalId || search.name || search.category){
      contains = {
        isActive: true,
        sucursalId : search.sucursalId ? search.sucursalId : '',
        name: search.name ? search.name : '',
        category: search.category ? search.category : ''
      };
      console.log(contains);
    }else{
      contains = {
        sucursalId : ''
      };
    }
  }

  var pagination = {
    start : (page - 1) * count,
    count : count
  };
  console.log(pagination);
  var filter = {
    filters: {
      mandatory: {
        contains
      }
    }
  };

  var sort = {
    sort: {
      desc: 'name',
    }
  };

  Product
  .find()
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
 * Product middleware
 */

 exports.getfilterProduct = function(req, res){
  Product
  .find({_id: {$regex: req.body.id,  $options: '-i' }}).limit(5).exec(function(err, Product){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Product);
    }
  });
};

exports.getfilterByCategoria = function(req, res){
  Product
  .find({ category: { $in: [req.body.categories] }}).exec(function(err, Product){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Product);
    }
  });
};


/**
 * Product middleware
 */
 exports.productByID = function(req, res, next, id) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Product is invalid'
  //   });
  // }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

/**
 * Create a Product
 */
 exports.create = function(req, res) {
  // Crear un nuevo objeto  Parametro
  var product = new Product(req.body);
  // // Configurar la propiedad 'creador' del Parametro
  product.craetedUser = req.user._id;

  // _.forEach(req.body.listProductPromotion, function(value, key) {
  //   console.log(key);
  //   console.log(value);
  // });
   //console.log(product);
   // console.log(JSON.stringify(req.body.listProductPromotion));
   // console.log(req.body.listProductPromotion);
   // // console.log(req.files);
   // res.status(200);

   if(req.files.file){
     // product.picturesURL = 'modules/products/img/uploads/' + req.files.file.name;
     fs.writeFile('./modules/products/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        //verificar si el req.product.picturesURL tiene una fotol
      if(product.picturesURL){
        console.log(fs.existsSync(product.picturesURL));
      // fs.stat(product.picturesURL, function (err, stats) {
      //   console.log(stats);//here we got all information of file in stats variable
      //    if (err) {
      //       return console.error(err);
      //     }
      //  fs.unlink(product.picturesURL,function(err){
      //    if(err) return console.log(err);
      //    console.log('file deleted successfully');
      //    });
      //  });
       }
        //product.picturesURL

        product.picturesURL = 'modules/products/img/uploads/' + req.files.file.name;
        // console.log(product);

        if(req.body.modeOn === 'update'){
          console.log(req.body);
          Product.findById(req.body._id).exec(function(err, product){
            product = _.extend(product , req.body);
            product.picturesURL = 'modules/products/img/uploads/' + req.files.file.name;
            product.save(function(err) {
              if (err) {
                console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.jsonp(product);
              }
            });
          });
        }else{
          product.save(function(err) {
            if (err) {

              console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(product);
        }
      });
        }
      }
    });
   }else{
     product.save(function(err) {
      if (err) {

        console.log(err);
      // Si ocurre algún error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
          // Enviar una representación JSON del artículo
          res.json(product);
        }
      });
   }
 };


/**
 * Product middleware
 */
 exports.productFilter = function(req, res) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Product is invalid'
  //   });
  // }

  Product.find({$and: [ {isActive: true, sucursalId: req.body.sucursalId },  { $or: [ { name: {$regex: req.body.bardCode,  $options: '-i'}}, {bardCode: req.body.bardCode}]} ]})
  .populate('user', 'promotionItems.product')
  .limit(5)
  .exec(function (err, product) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {

    console.log(product);

   // product = _.filter(product, function(o) { return  o.; });
   console.log(product);
   res.jsonp(product);
 }
});
};

exports.getPosProduct = function(req, res) {
  Product.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.product')
  .exec(function (err, product) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      console.log(req.body.categories);
      _.forEach(product, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(product);
    }
  }
});
};



exports.getProductBySucursal = function(req, res) {
  Product.find({isActive: true, sucursalId: req.body.sucursalId })
  .populate('user', 'promotionItems.product')
  .exec(function (err, product) {
   if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    if(req.body.categories){
      var result = [];
      console.log(req.body.categories);
      _.forEach(product, function(item){
       if(item.category){
        if(_.includes(req.body.categories, item.category)){
          result.push(item);
        }
      }
    });
      res.jsonp(result);
    }else{
      res.jsonp(product);
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
