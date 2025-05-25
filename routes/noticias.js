const express = require("express");
const router = express.Router();
const axios = require("axios");

// 📰 GET /noticias — retorna apenas notícias de finanças e empreendedorismo
router.get("/", async (req, res) => {
  try {
    const resposta = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "finanças OR empreendedorismo OR economia OR investimentos OR renda extra OR finanças pessoais",
        language: "pt",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const dados = resposta.data.articles.map((artigo) => ({
      title: artigo.title,
      description: artigo.description,
      url: artigo.url,
      image: artigo.urlToImage,
    }));

    res.json({ sucesso: true, dados });
  } catch (err) {
    console.error("❌ Erro ao buscar notícias:", err.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar notícias" });
  }
});

module.exports = router;
