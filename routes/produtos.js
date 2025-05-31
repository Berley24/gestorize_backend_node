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

// 🟢 Rota para buscar produto por ID (apenas se for do usuário autenticado)
router.get("/:id", async (req, res) => {
  const { userId } = getAuth(req);
  const produtoId = req.params.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM produtos WHERE id = ? AND user_id = ?",
      [produtoId, userId]
    );

    if (rows.length > 0) {
      res.json({ sucesso: true, produto: rows[0] });
    } else {
      res.status(404).json({ sucesso: false, erro: "Produto não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    res.status(500).json({ erro: "Erro ao buscar produto." });
  }
});

// 🟢 Rota para deletar produto por ID (apenas se for do usuário autenticado)
router.delete("/:id", async (req, res) => {
  const { userId } = getAuth(req);
  const produtoId = req.params.id;

  try {
    const [resultado] = await db.query(
      "DELETE FROM produtos WHERE id = ? AND user_id = ?",
      [produtoId, userId]
    );

    if (resultado.affectedRows > 0) {
      res.json({ sucesso: true });
    } else {
      res.status(404).json({ sucesso: false, erro: "Produto não encontrado ou não pertence ao usuário." });
    }
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    res.status(500).json({ erro: "Erro ao deletar o produto." });
  }
});

module.exports = router;
