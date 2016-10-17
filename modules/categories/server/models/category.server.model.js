'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');
  autoIncrement.initialize(mongoose);

/**
 * Categories Schema
 */
var CategorySchema = new Schema({
  _id: {type: String},
  name: { type: String, required: 'Nombre de la Categoria requerido', unique: true, trim: true},
  parent: {type: String, default: '', ref: 'Category'},
  ancestors: [{type: String, ref: 'Category'}],
  isActive: {type: Boolean, default:true},
  createdDate: { type: Date, default: Date.now},
  craetedUser: { type: Schema.ObjectId, ref: 'User'},
  updatedDate: {type: Date},
  updatedUser: { type: Schema.ObjectId, ref: 'User'}
});


CategorySchema.plugin(autoIncrement.plugin, {
    model: 'Category',
    field: 'categoryId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Category', CategorySchema);
