'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Cajaturnos Schema
 */
 var CajaturnoSchema = new Schema({
  sucursalId: { type: String, ref: 'Sucursal', default: null},
  caja: { type: String, ref: 'Cajas', default: null},
  isActive: {type: Boolean, default:true},
  inUse: {type: Boolean, default:true},
  cuadreOpen: {},
  cuadreCierre: {},
  createdDate: { type: Date, default: Date.now},
  cierreDate: { type: Date},
  createdUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});


 CajaturnoSchema.plugin(autoIncrement.plugin, {
  model: 'Cajaturno',
  field: 'turnoId',
  startAt: 10001,
  incrementBy: 1
}
);

mongoose.model('Cajaturno', CajaturnoSchema);