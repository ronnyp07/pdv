
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
/**
 * Sucursal Schema
 */
 var SucursalSchema = new Schema({
  name: {
    type: String,
    required: 'Nombre requerido',
    unique: true,
    trim: true
  },
  tipoDocumento: {
    type: String,
    ref: 'Parameters'
  },
  companyId: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  documento: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  representante: {
    type: String,
    trim: true
  },
   picturesURL: {
    type: String,
    trim: true
  },
  porcentaje: {
    type: Number,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  craetedUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updatedDate: {
    type: Date
  },
  updatedUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
 SucursalSchema.plugin(autoIncrement.plugin, {
  model: 'Sucursal',
  field: 'sucursalId',
  startAt: 100,
  incrementBy: 1
});
 mongoose.model('Sucursal', SucursalSchema);