'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');
 autoIncrement.initialize(mongoose);

/**
 * Log Schema
 */
 var LogSchema = new Schema({
  name: { type: String, default: '', trim: true},
  active: { type: Boolean, default: true},
  createdDate: { type: Date, default: Date.now},
  createdUser: { type: String, trim: true},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

 LogSchema.plugin(autoIncrement.plugin, {
  model: 'Log',
  field: 'logId',
  startAt: 10001,
  incrementBy: 1
}
);
mongoose.model('Log', LogSchema);

