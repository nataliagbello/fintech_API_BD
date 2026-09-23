# API REST - Fintech

Projeto desenvolvido para a disciplina de **Banco de Dados** da **UFRJ**.

## Tecnologias

- Node.js
- Express
- SQLite
- Postman

## Entidades

O banco de dados possui 6 entidades principais:

- Cliente
- Conta
- Cartão
- Empréstimo
- Investimento
- Transação

## Como executar

Clone o repositório:

```bash
git clone https://github.com/nataliagbello/fintech_API_BD.git
cd fintech_API_BD
```

Instale as dependências:

```bash
npm install
```

Inicie a API:

```bash
node index.js
```

A API estará disponível em:

```text
http://localhost:3000
```

## Rotas

| Entidade | GET | POST |
|---|---|---|
| Cliente | `/clientes` | `/clientes` |
| Conta | `/contas` | `/contas` |
| Cartão | `/cartoes` | `/cartoes` |
| Empréstimo | `/emprestimos` | `/emprestimos` |
| Investimento | `/investimentos` | `/investimentos` |
| Transação | `/transacoes` | `/transacoes` |

## Autoria

**Natália Guimarães**  
Engenharia Eletrônica e de Computação — UFRJ
