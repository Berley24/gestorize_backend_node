const express = require("express");
const router = express.Router();

const {
  listarCategorias,
  cadastrarCategoria,
  editarCategoria,
  removerCategoria,
  listarCategoriasComVariaveis,
  cadastrarVariavelCategoria,
  buscarCategoriaPorVariavel
} = require("../controllers/categoriasController");

// 📂 Categorias
router.get("/", listarCategorias);                         // Listar categorias
router.post("/", cadastrarCategoria);                      // Cadastrar nova categoria
router.put("/:id", editarCategoria);                       // Editar categoria
router.delete("/:id", removerCategoria);                   // Remover categoria

// 📂 Categorias + Variáveis
router.get("/completo", listarCategoriasComVariaveis);     // Listar categorias com variáveis

// ➕ Variáveis de categoria
router.post("/variavel", cadastrarVariavelCategoria);      // Cadastrar nova variável

// 🔍 Buscar categoria automaticamente por nome da variável
router.get("/buscar-categoria", buscarCategoriaPorVariavel); // Ex: /categorias/buscar-categoria?nome=luz

module.exports = router;
