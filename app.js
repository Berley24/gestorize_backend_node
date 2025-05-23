require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas públicas (sem autenticação)
app.use("/produtos", require("./routes/produtos"));
app.use("/custos", require("./routes/custos"));
app.use("/contas", require("./routes/contas"));
app.use("/movimentacoes", require("./routes/movimentacoes"));
app.use("/cotacoes", require("./routes/cotacoes")); // pública

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

