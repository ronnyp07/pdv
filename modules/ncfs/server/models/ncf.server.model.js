'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');
  autoIncrement.initialize(mongoose);

/**
 * Lote Schema
 */
var LoteSchema = new Schema({
  code: { type: String, default: '', required: 'Please fill Lote name', trim: true},
  desc: {type: String, default:true},
  sucursalId: { type: String, ref: 'Sucursal'},
  secInicial: {type: Number, trim: true},
  secFinal: {type: Number, trim: true},
  secuencia: {type: Number, trim: true},
  serie: { type: String, trim: true},
  dn: { type: String, trim: true},
  pe: { type: String, trim: true},
  ai: { type: String, trim: true},
  tcf: { type: String, trim: true},
  loteDateCreated: { type: Date, default: Date.now},
  loteDateCaducidad: { type: Date, default: Date.now},
  isActive: {type: Boolean, default:true},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 LoteSchema.plugin(autoIncrement.plugin, {
  model: 'Ncf',
  field: 'ncfId',
  startAt: 100,
  incrementBy: 1
}
);

mongoose.model('Ncf', LoteSchema);



