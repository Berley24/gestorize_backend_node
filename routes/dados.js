const express = require("express");
const router = express.Router();
const db = require("../db/conexao");
const requireAuth = require("../middlewares/authMiddleware"); // Clerk

// 📥 POST /dados — salva um novo dado com segurança
router.post("/", requireAuth, async (req, res) => {
  const { dado } = req.body;
  const usuario_id = req.auth.userId; // ✅ vem do Clerk

  if (!dado) {
    return res.status(400).json({ erro: "O campo 'dado' é obrigatório." });
  }

  try {
    await db.query(
      "INSERT INTO dados (usuario_id, dado) VALUES (?, ?)",
      [usuario_id, dado]
    );
    res.json({ sucesso: true, mensagem: "Dado salvo com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao salvar dado:", error);
    res.status(500).json({ erro: "Erro ao salvar dado." });
  }
});

// 📤 GET /dados — lista apenas os dados do usuário logado
router.get("/", requireAuth, async (req, res) => {
  const usuario_id = req.auth.userId;

  try {
    const [dados] = await db.query(
      "SELECT * FROM dados WHERE usuario_id = ? ORDER BY created_at DESC",
      [usuario_id]
    );
    res.json({ dados });
  } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
    res.status(500).json({ erro: "Erro ao buscar dados." });
  }
});

module.exports = router;
