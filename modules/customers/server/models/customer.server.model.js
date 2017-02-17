'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');
  autoIncrement.initialize(mongoose);

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Customer name',
    trim: true
  },
  lastName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
      street: String
  },
  fullName : {
    type: String
  },
  identity : {
     type: String,
     trim: true
  },
  price : {
    type: String,
    trim: true
  },
  autorizedCredit: {
    type: Boolean,
    default: false
  },
  autorizedAmmount: {
    type: Number,
    default: 0
  },
  peddingAmmount: {
    type: Number,
    default: 0
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

CustomerSchema.plugin(autoIncrement.plugin, {
    model: 'Customer',
    field: 'customerId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Customer', CustomerSchema);
