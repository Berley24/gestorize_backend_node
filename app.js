
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Lista de domínios permitidos para CORS
const allowedOrigins = [
  "https://gestorize.netlify.app",
  "http://localhost:5173"
];

// Configuração do CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origem (como as feitas por ferramentas de teste)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Origem bloqueada por CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Middleware para lidar com requisições OPTIONS (preflight)
app.options("*", cors(corsOptions));

app.use(express.json());

// Servir arquivos estáticos da pasta uploads
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

// Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
