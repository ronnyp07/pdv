'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 autoIncrement = require('mongoose-auto-increment');

 autoIncrement.initialize(mongoose);

/**
 * Providers Schema
 */
 var ProvidersSchema = new Schema({
  name: { type: String, required: 'Nombre del parametro requerido', unique: true, trim: true},
  RNC: {type: String, default: ''},
  phones: {
    cellphone: {type: String, trim: true},
    offices: {type: String, trim: true}
  },
  creditLimit: {type:String, trim: true},
  limitDays: {type:String, trim: true},
  contact: {type:String, trim: true},
  razonSocial: {type:String, trim: true},
  email : {type: String, trim: true},
  address: {type: String, trim: true},
  isActive: {type: Boolean, default:true},
  systemParam: {type: Boolean, default:false},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});


 ProvidersSchema.plugin(autoIncrement.plugin, {
  model: 'Providers',
  field: 'providerId',
  startAt: 100,
  incrementBy: 1
}
);

 mongoose.model('Providers', ProvidersSchema);