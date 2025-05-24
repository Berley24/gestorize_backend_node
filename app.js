require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

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
  res.send("🚀 API Gestorize online");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
