const express = require("express");
const router = express.Router();
const con = require('../repository/connection');

router.get('/carteira', function (req, res) {
    console.log('Consultando saldo atual da carteira');

    con.query("SELECT ifnull((select SUM(valor) from movimentacoes where tipo = 'ENTRADA'), 0) - ifnull((select SUM(valor) from movimentacoes where tipo = 'SAIDA'), 0) AS saldo", function (err, result) {
        if (err) {
            throw err;
        }
        res.send(result[0]);
    });
});

module.exports = router;