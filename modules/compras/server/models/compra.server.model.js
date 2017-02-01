'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Compra Schema
 */
 var CompraSchema = new Schema({
  name: { type: String, default: '', trim: true},
  sucursalId: { type: String, ref: 'Sucursal', default: null},
  documentType: {type: String, ref: 'Parameters', default: null},
  tipoPago: {type: String, ref: 'Parameters', default: null},
  serie: {type: String, trim: true},
  noVenta: {type: String, trim: true},
  fecha_compra: { type: Date},
  provider: {type: String, ref:'Providers', default: null},
  itbs: {type: Number, trim: true},
  subtotal: {type: Number, trim: true},
  total: {type: Number, trim: true},
  cart:[],
  createdDate: { type: Date, default: Date.now},
  isValid: { type: Boolean, default: true},
  status: {type: String, ref: 'Parameters', default: null},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 CompraSchema.plugin(autoIncrement.plugin, {
  model: 'Compra',
  field: 'compraId',
  startAt: 10001,
  incrementBy: 1
}
);

 mongoose.model('Compra', CompraSchema);

