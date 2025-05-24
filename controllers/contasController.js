const db = require("../db/conexao");

// 🔍 LISTAR todas as contas
async function listarContas(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM contas ORDER BY data_vencimento ASC");
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ CADASTRAR conta com envio de comprovante
async function cadastrarContaComArquivo(req, res) {
  const { descricao, valor, data_vencimento, tipo } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  if (!descricao || !valor || !data_vencimento || !tipo) {
    return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios ausentes." });
  }

  try {
    const [resultado] = await db.query(
      "INSERT INTO contas (descricao, valor, data_vencimento, tipo, comprovante) VALUES (?, ?, ?, ?, ?)",
      [descricao, valor, data_vencimento, tipo, comprovante]
    );

    res.json({ sucesso: true, id: resultado.insertId });
  } catch (err) {
    console.error("❌ Erro ao salvar conta:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ✏️ EDITAR conta
async function editarConta(req, res) {
  const id = req.params.id;
  const { descricao, valor, data_vencimento, tipo } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  try {
    let sql = "UPDATE contas SET descricao = ?, valor = ?, data_vencimento = ?, tipo = ?";
    const params = [descricao, valor, data_vencimento, tipo];

    if (comprovante) {
      sql += ", comprovante = ?";
      params.push(comprovante);
    }

    sql += " WHERE id = ?";
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
