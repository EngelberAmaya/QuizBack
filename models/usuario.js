var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// var rolesValidos = {
// 	values: ['administrador','invitado'],
// 	message: '{VALUE} no es un rol permitido'
// };

var usuarioSchema = new Schema({

    contact: {
        type: Number,
        required: [true, 'contact is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    score: {
        type: Number,
        default:0,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    role: {
        type: String
        //enum: rolesValidos    
    },
    blocked: {
        type: Boolean, default: false
    }

}, { timestamp: true });

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único'});

module.exports = mongoose.model('usuarios', usuarioSchema)