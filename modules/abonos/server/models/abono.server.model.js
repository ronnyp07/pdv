'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Abono Schema
 */
 var AbonoSchema = new Schema({
  customer : { type: String, ref: 'Customer', default: null},
  sales : {type: String, ref: 'Sales', default: null},
  session : {type: String, ref: 'Sessions', default: null},
  tipoPago: {type: String,  default: null},
  montoTotal: {type: Number, trim: true},
  isValid: { type: Boolean, default: true},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 AbonoSchema.plugin(autoIncrement.plugin, {
  model: 'Abono',
  field: 'abonoId',
  startAt: 10001,
  incrementBy: 1
}
);
mongoose.model('Abono', AbonoSchema);

