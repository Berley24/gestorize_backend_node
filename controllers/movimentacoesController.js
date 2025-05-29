const db = require("../db/conexao");

// ✅ Listar apenas movimentações do usuário logado
async function listarMovimentacoes(req, res) {
  const userId = req.userId;

  try {
    const [rows] = await db.query(
      "SELECT * FROM movimentacoes WHERE user_id = ? ORDER BY data_registro DESC",
      [userId]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    console.error("❌ Erro ao listar movimentações:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao listar movimentações." });
  }
}

// ✅ Adicionar movimentação vinculada ao user_id
async function adicionarMovimentacao(req, res) {
  const userId = req.userId;
  const { descricao, valor, tipo } = req.body;

  if (!descricao || !valor || !["entrada", "saida"].includes(tipo)) {
    return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
  }

  try {
    await db.query(
      "INSERT INTO movimentacoes (descricao, valor, tipo, origem, user_id) VALUES (?, ?, ?, 'manual', ?)",
      [descricao, valor, tipo, userId]
    );
    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao adicionar movimentação:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao adicionar movimentação." });
  }
}

// ✅ Excluir apenas se pertencer ao usuário
async function deletarMovimentacao(req, res) {
  const userId = req.userId;
  const id = req.params.id;

  try {
    // Verifica se pertence ao user antes de deletar
    const [verifica] = await db.query(
      "SELECT * FROM movimentacoes WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (verifica.length === 0) {
      return res.status(404).json({ sucesso: false, erro: "Movimentação não encontrada ou acesso negado." });
    }

    await db.query("DELETE FROM movimentacoes WHERE id = ?", [id]);

    res.json({ sucesso: true, mensagem: "Movimentação excluída com sucesso." });
  } catch (err) {
    console.error("❌ Erro ao excluir movimentação:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao excluir movimentação." });
  }
}

module.exports = {
  listarMovimentacoes,
  adicionarMovimentacao,
  deletarMovimentacao,
};
