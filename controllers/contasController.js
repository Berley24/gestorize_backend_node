const db = require("../db/conexao");

// 🔍 LISTAR contas do usuário logado
async function listarContas(req, res) {
  const usuario_id = req.auth.userId;

  try {
    const [rows] = await db.query(
      "SELECT * FROM contas WHERE usuario_id = ? ORDER BY data_vencimento ASC",
      [usuario_id]
    );
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ CADASTRAR conta com comprovante
async function cadastrarContaComArquivo(req, res) {
  const { descricao, valor, data_vencimento, tipo } = req.body;
  const usuario_id = req.auth.userId;
  const comprovante = req.file ? req.file.filename : null;

  if (!descricao || !valor || !data_vencimento || !tipo) {
    return res.status(400).json({ sucesso: false, erro: "Campos obrigatórios ausentes." });
  }

  try {
    const [resultado] = await db.query(
      "INSERT INTO contas (descricao, valor, data_vencimento, tipo, comprovante, usuario_id) VALUES (?, ?, ?, ?, ?, ?)",
      [descricao, valor, data_vencimento, tipo, comprovante, usuario_id]
    );

    res.json({ sucesso: true, id: resultado.insertId });
  } catch (err) {
    console.error("❌ Erro ao salvar conta:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ✏️ EDITAR conta do usuário
async function editarConta(req, res) {
  const id = req.params.id;
  const { descricao, valor, data_vencimento, tipo } = req.body;
  const usuario_id = req.auth.userId;
  const comprovante = req.file ? req.file.filename : null;

  try {
    // Confere se a conta pertence ao usuário
    const [check] = await db.query("SELECT id FROM contas WHERE id = ? AND usuario_id = ?", [id, usuario_id]);
    if (check.length === 0) {
      return res.status(403).json({ sucesso: false, erro: "Conta não encontrada ou sem permissão." });
    }

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

// 🗑️ REMOVER conta do usuário
async function removerConta(req, res) {
  const id = req.params.id;
  const usuario_id = req.auth.userId;

  try {
    const [check] = await db.query("SELECT id FROM contas WHERE id = ? AND usuario_id = ?", [id, usuario_id]);
    if (check.length === 0) {
      return res.status(403).json({ sucesso: false, erro: "Conta não encontrada ou sem permissão." });
    }

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
