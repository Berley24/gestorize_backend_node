const express = require("express");
const router = express.Router();
const { ClerkExpressRequireAuth, getAuth } = require("@clerk/express");

const {
  listarMovimentacoes,
  adicionarMovimentacao,
  deletarMovimentacao
} = require("../controllers/movimentacoesController");

// Middleware de autenticação Clerk
router.use(ClerkExpressRequireAuth());

// Middleware para injetar o userId no req
function adicionarUserIdAoRequest(req, res, next) {
  const { userId } = getAuth(req);
  req.userId = userId;
  next();
}

// Rotas protegidas
router.get("/", adicionarUserIdAoRequest, listarMovimentacoes);
router.post("/", adicionarUserIdAoRequest, adicionarMovimentacao);
router.delete("/:id", adicionarUserIdAoRequest, deletarMovimentacao);

module.exports = router;
