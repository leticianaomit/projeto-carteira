const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const movimentacaoController = require('./controller/movimentacoes-controller');
const carteiraController = require('./controller/carteira-controller');
const categoriasController = require('./controller/categorias-controller');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('view'));
app.use('/', movimentacaoController);
app.use('/', carteiraController);
app.use('/', categoriasController);

app.listen(8080, function() {
    console.log('Servidor rodando na porta 8080');
});