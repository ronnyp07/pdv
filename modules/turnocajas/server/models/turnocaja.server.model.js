'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Turnocaja Schema
 */
var TurnocajaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Turnocaja name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Turnocaja', TurnocajaSchema);
