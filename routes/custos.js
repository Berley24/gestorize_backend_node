const express = require("express");
const router = express.Router();

const {
  listarCustos,
  buscarCustoPorId,
  calcularCustos,
  excluirCalculo,
  buscarUltimoCusto,
} = require("../controllers/custosController");

// 🔓 Rotas públicas
router.get("/", listarCustos);
router.get("/:id", buscarCustoPorId);
router.post("/", calcularCustos);
router.delete("/:id", excluirCalculo);
router.post("/ultimo", buscarUltimoCusto);

module.exports = router;
