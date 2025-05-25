const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const requireAuth = require("../middlewares/authMiddleware"); // ✅ Middleware do Clerk

const {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta
} = require("../controllers/contasController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ TODAS AS ROTAS agora exigem login e usam o usuario_id
router.get("/", requireAuth, listarContas);
router.post("/", requireAuth, upload.single("comprovante"), cadastrarContaComArquivo);
router.put("/:id", requireAuth, editarConta);
router.delete("/:id", requireAuth, removerConta);

module.exports = router;
