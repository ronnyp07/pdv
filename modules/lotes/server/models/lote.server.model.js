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
  noLote: { type: String, default: '', required: 'Please fill Lote name', trim: true},
  category: {type: String, ref: 'Parameters'},
  sucursalId: { type: String, ref: 'Sucursal'},
  productId: {type: String, ref: 'Products'},
  exInicial: {type: Number, default:true},
  exFinal: {type: Number, default:true},
  loteDateCreated: { type: Date, default: Date.now},
  loteDateCaducidad: { type: Date, default: Date.now},
  isActive: {type: Boolean, default:true},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 LoteSchema.plugin(autoIncrement.plugin, {
  model: 'Lote',
  field: 'loteId',
  startAt: 100,
  incrementBy: 1
}
);

mongoose.model('Lote', LoteSchema);


