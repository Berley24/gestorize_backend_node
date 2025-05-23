const db = require("../db/conexao");

// 🔍 LISTAR todos os produtos
async function listarProdutos(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, nome FROM produtos ORDER BY nome ASC"
    );
    res.json({ sucesso: true, produtos: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ CADASTRAR produto (sem vínculo ao usuário)
async function cadastrarProduto(req, res) {
  const { nome, categoria, unidade, preco_base } = req.body;

  if (!nome) {
    return res.status(400).json({ sucesso: false, erro: "Nome é obrigatório." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO produtos (nome, categoria, unidade, preco_base) VALUES (?, ?, ?, ?)",
      [nome, categoria, unidade, preco_base]
    );
    res.json({ sucesso: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

module.exports = { listarProdutos, cadastrarProduto };
