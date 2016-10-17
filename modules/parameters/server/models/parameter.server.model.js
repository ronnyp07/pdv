'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

    autoIncrement.initialize(mongoose);

/**
 * Parameters Schema
 */
var ParametersSchema = new Schema({
  _id: {type: String},
  name: { type: String, required: 'Nombre del parametro requerido', unique: true, trim: true},
  parent: {type: String, default: '', ref: 'Parameters'},
  description: {type: String, default: ''},
  ancestors: [{type: String, ref: 'Parameters'}],
  isActive: {type: Boolean, default:true},
  systemParam: {type: Boolean, default:false},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});


ParametersSchema.plugin(autoIncrement.plugin, {
    model: 'Parameters',
    field: 'parameterId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Parameters', ParametersSchema);