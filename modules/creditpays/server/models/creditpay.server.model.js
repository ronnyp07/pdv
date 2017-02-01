'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Creditpay Schema
 */
 var CreditpaySchema = new Schema({
  numero: {type: String, trim: true},
  date:{ type: String, trim:true},
  day: {type: String, trim: true},
  cantidad: {type: Number, trim: true},
  order: {type: String, ref:'Cajas', default: null},
  session : {type: String, ref: 'Sessions', default: null},
  createdDate: { type: Date, default: Date.now},
  isValid: { type: Boolean, default: true},
  isPending: { type: Boolean, default: true},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});

CreditpaySchema.plugin(autoIncrement.plugin, {
  model: 'Creditpay',
  field: 'creditpayId',
  startAt: 10001,
  incrementBy: 1
}
);

mongoose.model('Creditpay', CreditpaySchema);

