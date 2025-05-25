const { getAuth } = require("@clerk/express");

function requireAuth(req, res, next) {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({ erro: "Não autenticado." });
  }

  req.auth = auth; // ✅ Agora `req.auth.userId` vai existir
  next();
}

module.exports = requireAuth;
