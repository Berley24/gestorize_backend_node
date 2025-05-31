require("dotenv").config();
const express = require("express");
const path = require("path");
const { requireAuth, getAuth } = require("@clerk/express");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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

// 🟢 Rota raiz atualizada para JSON
// 🟢 Rota raiz atualizada para chamar a /custos e trazer já os dados de custos
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
