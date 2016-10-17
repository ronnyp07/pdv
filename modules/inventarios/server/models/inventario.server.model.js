'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Inventario Schema
 */
 var InventarioSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Inventario name',
    trim: true
  },
  sucursalId: { type: String, ref: 'Sucursal'},
  listinventoryPromotion:[],
  createdDate: { type: Date, default: Date.now},
  isValid: { type: Boolean, default: true},
  status: {type: String, ref: 'Parameters'},
  createdUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 InventarioSchema.plugin(autoIncrement.plugin, {
  model: 'Inventario',
  field: 'inventarioId',
  startAt: 100,
  incrementBy: 1
}
);

 mongoose.model('Inventario', InventarioSchema);
