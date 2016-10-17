'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Partner Schema
 */
var PartnerSchema = new Schema({
  name: { type: String, default: '', trim: true},
  imp_Type: {type: String, default: '', trim: true},
  imp_Porcentaje: {type: String, default: '', trim: true},
  moneda: {type: String, default: '', trim: true},
  picturesURL: {type: String, trim: true},
  isValid: { type: Boolean, default: true},
  createdDate: { type: Date, default: Date.now},
  createdUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

PartnerSchema.plugin(autoIncrement.plugin, {
  model: 'Partner',
  field: 'partnerId',
  startAt: 10001,
  incrementBy: 1
}
);

mongoose.model('Partner', PartnerSchema);

