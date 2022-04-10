var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario')

// ============================================
// Crear un nuevo usuario con rol invitado
// ============================================

app.post('/invitado',  (req, res) => {

    var body = req.body;

    var usuarioInvitado = new Usuario({
        contact: body.contact,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        score: body.score,
        role: "invitado",
        blocked: body.role,
    });

    usuarioInvitado.save((err, usuarioGuardado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    })    
  
});

// ============================================
// Crear un nuevo usuario con rol supervisor
// ============================================

app.post('/supervisor',  (req, res) => {

    var body = req.body;

    var usuarioSupervisor = new Usuario({
        contact: body.contact,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        score: body.score,
        role: "supervisor",
        blocked: body.role,
    });

    usuarioSupervisor.save((err, usuarioGuardado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    })    
  
});


// ============================================
// Login
// ============================================

app.post('/login', (req, res) => {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
			return res.status(400).json({
				ok:false,
				mensaje: 'Credenciales incorrectas - password',
				errors: err
			});
		}

        // Crear un token
        var token = jwt.sign({usuario: usuarioDB}, SEED, { expiresIn: 3600 })

        res.status(200).json({
            ok: true,
            // usuario: usuarioDB,
            // token: token,
            // id: usuarioDB._id,
            token: token,
            role: usuarioDB.role,
            blocked: usuarioDB.blocked
        });

    })

});

module.exports = app;