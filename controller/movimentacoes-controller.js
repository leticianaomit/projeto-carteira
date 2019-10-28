const express = require("express");
const router = express.Router();
const con = require('../repository/connection');
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("movimentacoes.csv");
const moment = require("moment");

router.get('/csv', function (req, res) {
    let query = "select m.valor,m.tipo,ifnull(c.categoria,'Sem categoria') as categoria,m.observacao from movimentacoes as m left join categorias as c on m.id_categoria = c.id";
    if(req.query.mes !== 'null')
        query += ' where MONTH(data) = '+req.query.mes;
    con.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        const jsonData = JSON.parse(JSON.stringify(result));
        fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function() {
                console.log("Write to movimentacoes.csv successfully!");
            })
            .pipe(ws);
    });
});

router.get('/dashboard', function (req, res) {
    console.log('Salvando movimentação no servidor: ', req.body);

    con.query("select id as label,if(tipo='SAIDA',-1*valor,valor) as data from movimentacoes order by id desc limit 10", function (err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send(result);
    });
});

router.get('/historico', function (req, res) {
    con.query("select m.valor,m.tipo,ifnull(c.categoria,'Sem categoria') as categoria from movimentacoes as m left join categorias as c on m.id_categoria = c.id", function (err, result) {
        if (err) {
            throw err;
        }
        let retorno = {};
        retorno.data = result;
        res.send(retorno);
        console.log(retorno);
    });
});

router.get('/movimentacoes', function (req, res) {
    console.log('Buscando dados no servidor: ', req.query.tipo);

    con.query("select ifnull(c.categoria,'Sem categoria') as label,count(m.id) as data from movimentacoes as m left join categorias as c on m.id_categoria = c.id where m.tipo = '"+req.query.tipo+"' group by c.id", function (err, result) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
});

router.post('/movimentacoes', function (req, res) {
    console.log('Salvando movimentação no servidor: ', req.body);
    const movimentacaoBody = req.body;
    con.query('INSERT INTO movimentacoes SET ?', {
        id_categoria: movimentacaoBody.id_categoria,
        valor: movimentacaoBody.valor,
        tipo: movimentacaoBody.tipo,
        observacao: movimentacaoBody.observacao,
        data: moment().format('YYYY-MM-DD')
    }, function (err, result) {
        if (err) {
            throw err;
        }
        con.end();
        res.send(movimentacaoBody);
    });
});

module.exports = router;