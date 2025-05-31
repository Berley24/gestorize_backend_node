const express = require("express");
const router = express.Router();
const { getAuth } = require("@clerk/express");
const db = require("../db/conexao");

// 🟢 Rota para listar produtos (apenas do usuário autenticado)
router.get("/", async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const [produtos] = await db.query(
      "SELECT * FROM produtos WHERE user_id = ?",
      [userId]
    );
    res.json({ produtos });
  } catch (error) {
    console.error("Erro ao listar produtos:", error.message);
    res.status(500).json({ erro: "Erro ao listar produtos" });
  }
});

// 🟢 Rota para cadastrar produto (associando ao usuário autenticado)
router.post("/", async (req, res) => {
  const { userId } = getAuth(req);
  const { nome, categoria, unidade, preco_base } = req.body;

  try {
    await db.query(
      "INSERT INTO produtos (nome, categoria, unidade, preco_base, user_id) VALUES (?, ?, ?, ?, ?)",
      [nome, categoria, unidade, preco_base, userId]
    );
    res.json({ sucesso: true });
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error.message);
    res.status(500).json({ erro: "Erro ao cadastrar o produto" });
  }
});

module.exports = router;
// 🟢 Rota para buscar produto por ID (do usuário autenticado)