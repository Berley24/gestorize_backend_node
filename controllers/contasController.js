const db = require("../db/conexao");

// 🔍 LISTAR todas as contas (com nome da categoria)
async function listarContas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT contas.*, categorias.nome AS nome_categoria
      FROM contas
      LEFT JOIN categorias ON contas.categoria_id = categorias.id
      ORDER BY data_vencimento ASC
    `);

    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ➕ CADASTRAR conta com envio de comprovante e categoria
async function cadastrarContaComArquivo(req, res) {
  console.log("📥 REQ.BODY:", req.body);
  console.log("📎 REQ.FILE:", req.file);

  const { descricao, valor, data_vencimento, tipo, categoria_id } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  try {
    await db.query(
      "INSERT INTO contas (descricao, valor, data_vencimento, tipo, comprovante, categoria_id) VALUES (?, ?, ?, ?, ?, ?)",
      [descricao, valor, data_vencimento, tipo, comprovante, categoria_id || null]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao salvar conta:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ✏️ EDITAR conta
async function editarConta(req, res) {
  const id = req.params.id;
  const { descricao, valor, data_vencimento, tipo, categoria_id } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  try {
    let sql = `
      UPDATE contas 
      SET descricao = ?, valor = ?, data_vencimento = ?, tipo = ?, categoria_id = ?
    `;
    const params = [descricao, valor, data_vencimento, tipo, categoria_id || null];

    if (comprovante) {
      sql += `, comprovante = ?`;
      params.push(comprovante);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    await db.query(sql, params);

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🗑️ REMOVER conta
async function removerConta(req, res) {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM contas WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

module.exports = {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta
};
