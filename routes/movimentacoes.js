const express = require("express");
const router = express.Router();

const {
  listarMovimentacoes,
  adicionarMovimentacao,
  deletarMovimentacao, // 👈 adicionado aqui
} = require("../controllers/movimentacoesController");

// Rotas públicas
router.get("/", listarMovimentacoes);
router.post("/", adicionarMovimentacao);
router.delete("/:id", deletarMovimentacao); // 👈 rota DELETE adicionada aqui

module.exports = router;
