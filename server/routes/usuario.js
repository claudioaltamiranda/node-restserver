const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });


    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Usuario.find({ estado: true }, 'nombre email role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cont) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: cont
                });

            });

        })




});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    //  Eliminación física
    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     };

    //     res.json({
    //         ok: true,

    //         usuario: usuarioBorrado
    //     })

    // });

    // Eliminación lógica estado: false
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true },
        (err, usuarioBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                usuario: usuarioBorrado
            });

        });

});


module.exports = app;