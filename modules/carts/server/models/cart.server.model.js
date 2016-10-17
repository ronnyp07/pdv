'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CartSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Cart name',
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

mongoose.model('Cart', CartSchema);
