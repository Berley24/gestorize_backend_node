const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { ClerkExpressRequireAuth, getAuth } = require("@clerk/express");

const {
  listarContas,
  cadastrarContaComArquivo,
  editarConta,
  removerConta,
  listarCategorias,
  cadastrarCategoria,
  removerCategoria
} = require("../controllers/contasController");

// 📎 Middleware de autenticação para todas as rotas desse arquivo
router.use(ClerkExpressRequireAuth());

// 📎 Middleware para capturar o userId do Clerk
function adicionarUserIdAoRequest(req, res, next) {
  const { userId } = getAuth(req);
  req.userId = userId;
  next();
}

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
router.get("/", adicionarUserIdAoRequest, listarContas);
router.post("/", upload.single("comprovante"), adicionarUserIdAoRequest, cadastrarContaComArquivo);
router.put("/:id", adicionarUserIdAoRequest, editarConta);
router.delete("/:id", adicionarUserIdAoRequest, removerConta);

// ✅ Rotas de CATEGORIAS (também por usuário)
router.get("/categorias", adicionarUserIdAoRequest, listarCategorias);
router.post("/categorias", adicionarUserIdAoRequest, cadastrarCategoria);
router.delete("/categorias/:id", adicionarUserIdAoRequest, removerCategoria);

module.exports = router;
