async function listarMovimentacoes(req, res) {
  const userId = req.userId;

  try {
    const [rows] = await db.query(
      "SELECT * FROM movimentacoes WHERE user_id = ? ORDER BY data_registro DESC",
      [userId]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: "Erro ao listar movimentações." });
  }
}
