const db = require("../db/conexao");

async function listarMovimentacoes(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM movimentacoes ORDER BY data_registro DESC"
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    console.error("❌ Erro ao listar movimentações:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao listar movimentações." });
  }
}

async function adicionarMovimentacao(req, res) {
  try {
    const { descricao, valor, tipo } = req.body;

    if (!descricao || !valor || !["entrada", "saida"].includes(tipo)) {
      return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
    }

    await db.query(
      "INSERT INTO movimentacoes (descricao, valor, tipo, origem) VALUES (?, ?, ?, 'manual')",
      [descricao, valor, tipo]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao adicionar movimentação:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao adicionar movimentação." });
  }
}

async function deletarMovimentacao(req, res) {
  const id = req.params.id;

  try {
    const [resultado] = await db.query("DELETE FROM movimentacoes WHERE id = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, erro: "Movimentação não encontrada." });
    }

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
