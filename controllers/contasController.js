const db = require("../db/conexao");

// 🔍 LISTAR todas as contas do usuário
async function listarContas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT contas.*, categorias.nome AS nome_categoria
      FROM contas
      LEFT JOIN categorias ON contas.categoria_id = categorias.id
      WHERE contas.user_id = ?
      ORDER BY data_vencimento ASC
    `, [req.userId]);

    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// 🔍 Detectar categoria automaticamente
async function detectarCategoriaPorDescricao(descricao) {
  const [variaveis] = await db.query(`
    SELECT vc.categoria_id
    FROM variaveis_categoria vc
    WHERE ? LIKE CONCAT('%', vc.nome, '%')
    LIMIT 1
  `, [descricao.toLowerCase()]);
  return variaveis.length > 0 ? variaveis[0].categoria_id : null;
}

// ➕ CADASTRAR conta com envio de comprovante
async function cadastrarContaComArquivo(req, res) {
  const { descricao, valor, data_vencimento, tipo, categoria_id } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  try {
    let categoriaDetectada = categoria_id;

    if (!categoria_id || categoria_id === "") {
      categoriaDetectada = await detectarCategoriaPorDescricao(descricao);
    }

    await db.query(
      `INSERT INTO contas (descricao, valor, data_vencimento, tipo, comprovante, categoria_id, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [descricao, valor, data_vencimento, tipo, comprovante, categoriaDetectada, req.userId]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error("❌ Erro ao salvar conta:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ✏️ EDITAR conta (somente do próprio usuário)
async function editarConta(req, res) {
  const id = req.params.id;
  const { descricao, valor, data_vencimento, tipo, categoria_id } = req.body;
  const comprovante = req.file ? req.file.filename : null;

  try {
    // Verifica se a conta é do usuário
    const [verificacao] = await db.query("SELECT id FROM contas WHERE id = ? AND user_id = ?", [id, req.userId]);
    if (verificacao.length === 0) {
      return res.status(403).json({ sucesso: false, erro: "Acesso negado." });
    }

    let categoriaDetectada = categoria_id;

    if (!categoria_id || categoria_id === "") {
      categoriaDetectada = await detectarCategoriaPorDescricao(descricao);
    }

    let sql = `
      UPDATE contas 
      SET descricao = ?, valor = ?, data_vencimento = ?, tipo = ?, categoria_id = ?
    `;
    const params = [descricao, valor, data_vencimento, tipo, categoriaDetectada];

    if (comprovante) {
      sql += `, comprovante = ?`;
      params.push(comprovante);
    }

    sql += ` WHERE id = ? AND user_id = ?`;
    params.push(id, req.userId);

    await db.query(sql, params);

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🗑️ REMOVER conta (somente do próprio usuário)
async function removerConta(req, res) {
  const id = req.params.id;

  try {
    const [verificacao] = await db.query("SELECT id FROM contas WHERE id = ? AND user_id = ?", [id, req.userId]);
    if (verificacao.length === 0) {
      return res.status(403).json({ sucesso: false, erro: "Acesso negado." });
    }

    await db.query("DELETE FROM contas WHERE id = ? AND user_id = ?", [id, req.userId]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🔍 LISTAR categorias do usuário
async function listarCategorias(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM categorias WHERE user_id = ? ORDER BY nome ASC", [req.userId]);
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ CADASTRAR categoria
async function cadastrarCategoria(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ sucesso: false, erro: "Nome da categoria é obrigatório." });
  }

  try {
    await db.query("INSERT INTO categorias (nome, user_id) VALUES (?, ?)", [nome, req.userId]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🗑️ REMOVER categoria
async function removerCategoria(req, res) {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM categorias WHERE id = ? AND user_id = ?", [id, req.userId]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

module.exports = {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta,
  listarCategorias,
  cadastrarCategoria,
  removerCategoria
};
