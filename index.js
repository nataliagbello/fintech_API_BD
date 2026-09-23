const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./fintech.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

// Criar tabelas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Cliente (
        id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf_cnp TEXT NOT NULL,
        email TEXT NOT NULL,
        endereco TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Conta (
        id_conta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INTEGER NOT NULL,
        saldo_atual REAL NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Cartao (
        id_cartao INTEGER PRIMARY KEY AUTOINCREMENT,
        id_conta INTEGER NOT NULL,
        id_cliente INTEGER NOT NULL,
        numero_cartao TEXT NOT NULL,
        tipo TEXT NOT NULL,
        limite REAL NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (id_conta) REFERENCES Conta(id_conta),
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Emprestimo (
        id_emprestimo INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INTEGER NOT NULL,
        valor_solicitado REAL NOT NULL,
        taxa_juros REAL NOT NULL,
        numero_parcial INTEGER NOT NULL,
        status_analise TEXT NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Investimento (
        id_investimento INTEGER PRIMARY KEY AUTOINCREMENT,
        id_conta INTEGER NOT NULL,
        valor_aplicado REAL NOT NULL,
        data_aplicacao TEXT NOT NULL,
        taxa_rendimento REAL NOT NULL,
        tipo_produto TEXT NOT NULL,
        FOREIGN KEY (id_conta) REFERENCES Conta(id_conta)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Transacao (
        id_transacao INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INTEGER NOT NULL,
        id_conta_origem INTEGER NOT NULL,
        id_conta_destino INTEGER NOT NULL,
        id_cartao INTEGER,
        valor REAL NOT NULL,
        data_horario TEXT NOT NULL,
        tipo TEXT NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
        FOREIGN KEY (id_conta_origem) REFERENCES Conta(id_conta),
        FOREIGN KEY (id_conta_destino) REFERENCES Conta(id_conta),
        FOREIGN KEY (id_cartao) REFERENCES Cartao(id_cartao)
    )`);
});

// -------- CLIENTES --------
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM Cliente', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/clientes', (req, res) => {
    const { nome, cpf_cnp, email, endereco } = req.body;
    db.run(`INSERT INTO Cliente (nome, cpf_cnp, email, endereco) VALUES (?, ?, ?, ?)`, [nome, cpf_cnp, email, endereco], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Cliente cadastrado!', id_cliente: this.lastID });
    });
});

// -------- CONTAS --------
app.get('/contas', (req, res) => {
    db.all('SELECT * FROM Conta', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/contas', (req, res) => {
    const { id_cliente, saldo_atual, status } = req.body;
    db.run(`INSERT INTO Conta (id_cliente, saldo_atual, status) VALUES (?, ?, ?)`, [id_cliente, saldo_atual, status], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Conta criada!', id_conta: this.lastID });
    });
});

// -------- CARTOES --------
app.get('/cartoes', (req, res) => {
    db.all('SELECT * FROM Cartao', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/cartoes', (req, res) => {
    const { id_conta, id_cliente, numero_cartao, tipo, limite, status } = req.body;
    db.run(`INSERT INTO Cartao (id_conta, id_cliente, numero_cartao, tipo, limite, status) VALUES (?, ?, ?, ?, ?, ?)`, [id_conta, id_cliente, numero_cartao, tipo, limite, status], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Cartão cadastrado!', id_cartao: this.lastID });
    });
});

// -------- EMPRESTIMOS --------
app.get('/emprestimos', (req, res) => {
    db.all('SELECT * FROM Emprestimo', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/emprestimos', (req, res) => {
    const { id_cliente, valor_solicitado, taxa_juros, numero_parcial, status_analise } = req.body;
    db.run(`INSERT INTO Emprestimo (id_cliente, valor_solicitado, taxa_juros, numero_parcial, status_analise) VALUES (?, ?, ?, ?, ?)`, [id_cliente, valor_solicitado, taxa_juros, numero_parcial, status_analise], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Empréstimo registrado!', id_emprestimo: this.lastID });
    });
});

// -------- INVESTIMENTOS --------
app.get('/investimentos', (req, res) => {
    db.all('SELECT * FROM Investimento', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/investimentos', (req, res) => {
    const { id_conta, valor_aplicado, data_aplicacao, taxa_rendimento, tipo_produto } = req.body;
    db.run(`INSERT INTO Investimento (id_conta, valor_aplicado, data_aplicacao, taxa_rendimento, tipo_produto) VALUES (?, ?, ?, ?, ?)`, [id_conta, valor_aplicado, data_aplicacao, taxa_rendimento, tipo_produto], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Investimento registrado!', id_investimento: this.lastID });
    });
});

// -------- TRANSACOES --------
app.get('/transacoes', (req, res) => {
    db.all('SELECT * FROM Transacao', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows);
    });
});
app.post('/transacoes', (req, res) => {
    const { id_cliente, id_conta_origem, id_conta_destino, id_cartao, valor, data_horario, tipo } = req.body;
    db.run(`INSERT INTO Transacao (id_cliente, id_conta_origem, id_conta_destino, id_cartao, valor, data_horario, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id_cliente, id_conta_origem, id_conta_destino, id_cartao, valor, data_horario, tipo], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Transação registrada!', id_transacao: this.lastID });
    });
});

app.listen(3000, () => {
    console.log('API da Fintech rodando na porta 3000 (http://localhost:3000)');
});