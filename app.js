require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { requireAuth, getAuth } = require("@clerk/express");

const app = express();

// 🟢 Defina origens permitidas
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestorize.netlify.app"
];

// 🟢 Use o CORS de forma simples e confiável
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 🟢 Suporte a JSON
app.use(express.json());

// 🟢 Arquivos estáticos (ex: uploads de imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🟢 Rotas públicas
app.use("/cotacoes", require("./routes/cotacoes"));
app.use("/noticias", require("./routes/noticias"));
app.use("/categorias", require("./routes/categorias"));

// 🟢 Rotas protegidas (só quem está logado no Clerk)
app.use("/produtos", requireAuth(), require("./routes/produtos"));
app.use("/custos", requireAuth(), require("./routes/custos"));
app.use("/contas", requireAuth(), require("./routes/contas"));
app.use("/movimentacoes", requireAuth(), require("./routes/movimentacoes"));

// 🟢 Teste de autenticação
app.get("/usuario", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ mensagem: "Usuário autenticado", userId });
});

// 🟢 Rota raiz que retorna dados de custos (com autenticação!)
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


// 🟢 Inicialize o servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
