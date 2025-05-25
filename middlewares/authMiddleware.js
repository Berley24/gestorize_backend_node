const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Middleware que exige autenticação e injeta req.auth.userId
module.exports = ClerkExpressRequireAuth();
