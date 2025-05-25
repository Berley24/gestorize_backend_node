const db = require("../db/conexao");

// 🔍 Listar todas as categorias
async function listarCategorias(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM categorias ORDER BY nome ASC");
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ Cadastrar nova categoria
async function cadastrarCategoria(req, res) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ sucesso: false, erro: "Nome da categoria é obrigatório." });
  }

  try {
    await db.query("INSERT INTO categorias (nome) VALUES (?)", [nome]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ✏️ Editar categoria existente
async function editarCategoria(req, res) {
  const id = req.params.id;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ sucesso: false, erro: "Nome da categoria é obrigatório." });
  }

  try {
    await db.query("UPDATE categorias SET nome = ? WHERE id = ?", [nome, id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🗑️ Remover categoria
async function removerCategoria(req, res) {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

module.exports = {
  listarCategorias,
  cadastrarCategoria,
  editarCategoria,
  removerCategoria
};
