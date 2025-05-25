const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta,
  listarCategorias,
  cadastrarCategoria,
  removerCategoria
} = require("../controllers/contasController");

// 📎 Configuração do multer para salvar arquivos na pasta uploads/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Rotas de CONTAS
router.get("/", listarContas);
router.post("/", upload.single("comprovante"), cadastrarContaComArquivo);
router.put("/:id", editarConta);
router.delete("/:id", removerConta);

// ✅ Rotas de CATEGORIAS
router.get("/categorias", listarCategorias);
router.post("/categorias", cadastrarCategoria);
router.delete("/categorias/:id", removerCategoria);

module.exports = router;
