const db = require("../db/conexao");

async function listarMovimentacoes(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM movimentacoes ORDER BY data_registro DESC");
    res.json({ dados: rows }); // importante para o frontend funcionar corretamente
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function adicionarMovimentacao(req, res) {
  const { descricao, valor, tipo } = req.body;
  if (!descricao || !valor || !['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
  }

  try {
    await db.query(
      "INSERT INTO movimentacoes (descricao, valor, tipo, origem) VALUES (?, ?, ?, 'manual')",
      [descricao, valor, tipo]
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

module.exports = {
  listarMovimentacoes,
  adicionarMovimentacao
};
