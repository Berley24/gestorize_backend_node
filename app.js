require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

// Lista de domínios permitidos para CORS
const allowedOrigins = [
  "https://gestorize.netlify.app",
  "http://localhost:5173"
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

// Servir arquivos estáticos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas públicas
app.use("/produtos", require("./routes/produtos"));
app.use("/custos", require("./routes/custos"));
app.use("/contas", require("./routes/contas"));
app.use("/movimentacoes", require("./routes/movimentacoes"));
app.use("/cotacoes", require("./routes/cotacoes"));
app.use("/noticias", require("./routes/noticias"));
app.use("/dados", require("./routes/dados"));



// Rota raiz para teste
app.get("/", (req, res) => {
  res.send("API do Gestorize está funcionando!");
});

// Iniciar servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
