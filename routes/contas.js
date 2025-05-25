const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const requireAuth = require("../middlewares/authMiddleware"); // ✅

const {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta
} = require("../controllers/contasController");

// 📎 Configuração do multer para salvar arquivos
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Rotas protegidas (somente usuários autenticados)
router.get("/", requireAuth, listarContas);
router.post("/", requireAuth, upload.single("comprovante"), cadastrarContaComArquivo);
router.put("/:id", requireAuth, upload.single("comprovante"), editarConta);
router.delete("/:id", requireAuth, removerConta);

module.exports = router;
