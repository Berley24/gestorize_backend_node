require("dotenv").config();
const express = require("express");
const path = require("path");
const { ClerkExpressRequireAuth, getAuth } = require("@clerk/express");

const app = express();

// Lista de domínios permitidos para CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

// Configuração manual de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // pré-verificação CORS
  }

  next();
});

app.use(express.json());

// Servir arquivos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas públicas
app.use("/cotacoes", require("./routes/cotacoes"));
app.use("/noticias", require("./routes/noticias"));
app.use("/categorias", require("./routes/categorias"));

// Rotas protegidas com Clerk
app.use("/produtos", ClerkExpressRequireAuth(), require("./routes/produtos"));
app.use("/custos", ClerkExpressRequireAuth(), require("./routes/custos"));
app.use("/contas", ClerkExpressRequireAuth(), require("./routes/contas"));
app.use("/movimentacoes", ClerkExpressRequireAuth(), require("./routes/movimentacoes"));

// Rota protegida simples para teste
app.get("/usuario", ClerkExpressRequireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ mensagem: "Usuário autenticado", userId });
});

// Rota raiz
app.get("/", (req, res) => {
  res.send("API do Gestorize está funcionando!");
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
