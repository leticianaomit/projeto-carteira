const express = require("express");
const router = express.Router();
const con = require('../repository/connection');

router.post('/categorias', function (req, res) {
    console.log('Salvando categoria no servidor: ', req.body);
    const categoriaBody = req.body;
    con.query('INSERT INTO categorias SET ?', {
        categoria: categoriaBody.categoria
    }, function (err, result) {
        if (err) {
            throw err;
        }
        res.send(categoriaBody);
    });
});

router.get('/categorias', function (req, res) {
    console.log('Buscando categorias');

    con.query("SELECT * from categorias", function (err, result) {
        console.log(result);
        if (err) {
            throw err;
        }
        let retorno = {};
        retorno.data = result;
        res.send(retorno);
    });
});

module.exports = router;