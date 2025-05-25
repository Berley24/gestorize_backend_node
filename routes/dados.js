const express = require("express");
const router = express.Router();
const db = require("../db/conexao"); // ajuste se necessário
const requireAuth = require("../middlewares/authMiddleware");

// POST /dados - Salva com segurança usando o userId do Clerk
router.post("/", requireAuth, async (req, res) => {
  const { dado } = req.body;
  const userId = req.auth.userId;

  if (!dado) return res.status(400).json({ erro: "Campo 'dado' obrigatório" });

  try {
    await db.query("INSERT INTO dados (user_id, dado) VALUES (?, ?)", [userId, dado]);
    res.json({ sucesso: true, mensagem: "Dado salvo com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao salvar dado" });
  }
});

// GET /dados - Lista dados do próprio usuário
router.get("/", requireAuth, async (req, res) => {
  const userId = req.auth.userId;

  try {
    const [dados] = await db.query("SELECT * FROM dados WHERE user_id = ?", [userId]);
    res.json({ dados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
});

module.exports = router;
