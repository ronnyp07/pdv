'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Products Schema
 */
 var ProductsSchema = new Schema({
  name: { type: String, required: 'Nombre requerido', unique: true, trim: true},
  category: {type: String, ref: 'Parameters', default: 'Otros'},
  uMedida: {type: String, ref: 'Parameters'},
  taxesFlag: {},
  bardCode: {type: String, unique: true, trim: true},
  precios: {},
  localizacion: {type: String, unique: true, trim: true},
  description: {type: String, trim: true},
  brand: {type: String, ref: 'Parameters', default: 'Otros'},
  presentation: {type: String, ref: 'Parameters'},
  warehouseControl: {type: Boolean, default:true},
  unidadCompra : {type: String, ref: 'Parameters'},
  unidadVenta : {type: String, ref: 'Parameters'},
  unidades : {type: Number, default: 1},
  ventaDetalle: {type: Boolean, default:false},
  receta: {type: Boolean, default:false},
  lotes: {type: Boolean, default:false},
  servicio: {type: Boolean, default:false},
  neto: {type: Boolean, default:true},
  inStock: {type: Number, default: 0},
  stockDescription: {type: String, trim: true},
  minimumStock: {type: Number, default: 0},
  maximumStock : {type: Number, default: 0},
  productPromotion: {type: Boolean},
  listProductPromotion:[],
  cost: {type: String,trim: true},
  picturesURL: {type: String, trim: true},
  price:{type: String, trim: true},
  isPOS: {type: Boolean, default:true},
  applyTax: {type: Boolean, default:true},
  isActive: {type: Boolean, default:true},
  sucursalId: { type: String, ref: 'Sucursal'},
  systemParam: {type: Boolean},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 ProductsSchema.plugin(autoIncrement.plugin, {
  model: 'Products',
  field: 'productId',
  startAt: 100,
  incrementBy: 1
}
);

 mongoose.model('Products', ProductsSchema);