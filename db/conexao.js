//const mysql = require("mysql2/promise");

//const pool = mysql.createPool({
  //host: "localhost",
  //user: "root",
  //password: "",
  //database: "financeiro1",
  //waitForConnections: true,
  //connectionLimit: 10,
  //queueLimit: 0
//});

//module.exports = pool;


const mysql = require("mysql2");

const conexao = mysql.createConnection({
  host: "bmy5gfhqkqwbq5apgyx4-mysql.services.clever-cloud.com",
  user: "u2ewmgczt5egqhfj",
  password: "UzYNZeQiehr1WBrfEpNr",
  database: "bmy5gfhqkqwbq5apgyx4",
  port: 3306,
  ssl: { rejectUnauthorized: false } // necessário para Clever Cloud
});

conexao.connect(err => {
  if (err) console.error("Erro:", err);
  else console.log("Banco conectado com sucesso!");
});
