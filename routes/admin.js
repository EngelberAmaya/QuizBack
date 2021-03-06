var express = require('express');

var app = express();

var Usuario = require('../models/usuario')
var mdMiddlewares = require('../middlewares/autenticacion');

// ============================================
// Listado de usuarios invitados
// ============================================

app.get('/invitado', mdMiddlewares.verificaToken , (req, res, next) => {

    Usuario.find({ role: "invitado" }, 'contact email score role blocked')
        .exec(
            (err, usuariosInvitados) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
        
                res.status(200).json({
                    ok: true,
                    usuarios: usuariosInvitados
                });
        
            }
        );
      
  
});


// ============================================
// Listado de usuarios supervisor
// ============================================

app.get('/supervisor', mdMiddlewares.verificaToken, (req, res, next) => {

    Usuario.find({ role: "supervisor" }, 'contact email score role blocked')
        .exec(
            (err, usuarioSupervisor) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
        
                res.status(200).json({
                    ok: true,
                    usuarios: usuarioSupervisor
                });
        
            }
        );  
  
});

module.exports = app;