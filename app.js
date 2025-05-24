require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// Domínios permitidos para CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

// Middleware CORS manual
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// Servir arquivos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas públicas (sem autenticação)
app.use("/produtos", require("./routes/produtos"));
app.use("/custos", require("./routes/custos"));
app.use("/contas", require("./routes/contas"));
app.use("/movimentacoes", require("./routes/movimentacoes"));
app.use("/cotacoes", require("./routes/cotacoes"));

// Rota raiz para teste
app.get("/", (req, res) => {
  res.send("API do Gestorize está funcionando!");
});

// Porta obrigatória para o Render
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
