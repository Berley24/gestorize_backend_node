const express = require("express");
const router = express.Router();

const {
  listarMovimentacoes,
  adicionarMovimentacao
} = require("../controllers/movimentacoesController");

// Rotas públicas
router.get("/", listarMovimentacoes);
router.post("/", adicionarMovimentacao);

module.exports = router;
