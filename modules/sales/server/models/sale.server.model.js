'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Sales Schema
 */
 var SalesSchema = new Schema({
  sucursalId: { type: String, ref: 'Sucursal', default: null},
  documentType: {type: String, ref: 'Parameters', default: null},
  formaPago: {type: String, ref: 'Parameters', default: null},
  credito: {type: Number, trim: true},
  rango: {type: String, default: null},
  interes: {type: Number, trim: true},
  interesAmount: {type: Number, trim: true},
  fecha_venta: { type: Date},
  customer: {type: String, ref:'Customer', default: null},
  itbs: {type: Number, trim: true},
  subtotal: {type: Number, trim: true},
  total: {type: Number, trim: true},
  change: {type: Number, trim: true},
  pago: {type: Number, trim: true},
  saldo: {type: Number, trim: true},
  efectivo: {type: Number, trim: true},
  tarjeta: {type: Number, trim: true},
  vales: {type: Number, trim: true},
  transferencia: {type: Number, trim: true},
  cheque: {type: Number, trim: true},
  cart:[],
  isPending: { type: Boolean, default: true},
  caja: {type: String, ref:'Cajas', default: null},
  session : {type: String, ref: 'Sessions', default: null},
  createdDate: { type: Date, default: Date.now},
  isValid: { type: Boolean, default: true},
  status: {type: String, ref: 'Parameters', default: null},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 SalesSchema.plugin(autoIncrement.plugin, {
  model: 'Sales',
  field: 'salesId',
  startAt: 10001,
  incrementBy: 1
}
);

 mongoose.model('Sales', SalesSchema);

