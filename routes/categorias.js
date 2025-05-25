const express = require("express");
const router = express.Router();

const {
  listarCategorias,
  cadastrarCategoria,
  editarCategoria,
  removerCategoria
} = require("../controllers/categoriasController");

// Rotas para categorias
router.get("/", listarCategorias);
router.post("/", cadastrarCategoria);
router.put("/:id", editarCategoria);
router.delete("/:id", removerCategoria);

module.exports = router;
