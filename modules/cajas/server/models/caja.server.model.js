'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Cajas Schema
 */
 var CajaSchema = new Schema({
  name: { type: String, required: 'Nombre del parametro requerido', unique: true, trim: true},
  sucursalId: { type: String, ref: 'Sucursal'},
  isActive: {type: Boolean, default:true},
  inUse: {type: Boolean, default:false},
  session: {type: String, ref: 'Sessions'},
  systemParam: {type: Boolean, default:false},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});


 CajaSchema.plugin(autoIncrement.plugin, {
  model: 'Cajas',
  field: 'cajaId',
  startAt: 100,
  incrementBy: 1
}
);

 mongoose.model('Cajas', CajaSchema);