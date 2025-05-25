// 🔍 Listar todas as categorias com suas variáveis
async function listarCategoriasComVariaveis(req, res) {
  try {
    const [categorias] = await db.query("SELECT * FROM categorias ORDER BY nome ASC");
    const [variaveis] = await db.query("SELECT * FROM variaveis_categoria");

    const resultado = categorias.map((cat) => ({
      ...cat,
      variaveis: variaveis.filter(v => v.categoria_id === cat.id)
    }));

    res.json({ sucesso: true, dados: resultado });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// ➕ Cadastrar variável de categoria
async function cadastrarVariavelCategoria(req, res) {
  const { nome, categoria_id } = req.body;

  if (!nome || !categoria_id) {
    return res.status(400).json({ sucesso: false, erro: "Nome e categoria_id são obrigatórios." });
  }

  try {
    await db.query("INSERT INTO variaveis_categoria (nome, categoria_id) VALUES (?, ?)", [nome, categoria_id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

// 🔍 Buscar categoria com base no nome da variável
async function buscarCategoriaPorVariavel(req, res) {
  const { nome_variavel } = req.query;

  if (!nome_variavel) {
    return res.status(400).json({ sucesso: false, erro: "Nome da variável é obrigatório." });
  }

  try {
    const [rows] = await db.query(`
      SELECT c.id, c.nome 
      FROM categorias c
      JOIN variaveis_categoria v ON v.categoria_id = c.id
      WHERE LOWER(v.nome) = LOWER(?)
      LIMIT 1
    `, [nome_variavel]);

    if (rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: "Categoria não encontrada para essa variável." });
    }

    res.json({ sucesso: true, categoria: rows[0] });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}
