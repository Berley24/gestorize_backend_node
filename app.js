require("dotenv").config();
const express = require("express");
const cors = require("cors"); // ➜ Adicionado
const path = require("path");
const { requireAuth, getAuth } = require("@clerk/express");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

// ➜ Use o cors antes de tudo
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas públicas
app.use("/cotacoes", require("./routes/cotacoes"));
app.use("/noticias", require("./routes/noticias"));
app.use("/categorias", require("./routes/categorias"));

// Rotas protegidas
app.use("/produtos", requireAuth(), require("./routes/produtos"));
app.use("/custos", requireAuth(), require("./routes/custos"));
app.use("/contas", requireAuth(), require("./routes/contas"));
app.use("/movimentacoes", requireAuth(), require("./routes/movimentacoes"));

// Teste de autenticação
app.get("/usuario", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ mensagem: "Usuário autenticado", userId });
});

// 🟢 Rota raiz atualizada
app.get("/", requireAuth(), async (req, res) => {
  try {
    const db = require("./db/conexao");
    const [rows] = await db.query("SELECT * FROM calculos_custos ORDER BY id DESC");
    res.json({
      mensagem: "API do Gestorize está funcionando e dados de custos carregados.",
      dados: rows
    });
  } catch (error) {
    console.error("❌ Erro ao buscar custos:", error.message);
    res.status(500).json({ erro: "Erro ao buscar os dados de custos na rota raiz." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
