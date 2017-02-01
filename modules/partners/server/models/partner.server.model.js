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
  rnc: { type: String, default: '', trim: true},
  impuestosList: [],
  picturesURL: {type: String, trim: true},
  isValid: { type: Boolean, default: true},
  systemField: { type: Boolean, default: false},
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

