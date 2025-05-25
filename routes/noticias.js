const express = require("express");
const axios = require("axios");
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "finanças OR economia OR investimentos OR empreendedorismo OR dinheiro OR saúde financeira",
        language: "pt",
        sortBy: "publishedAt",
        pageSize: 10,
      },
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
    });

    const artigos = response.data.articles.map((artigo) => ({
      title: artigo.title,
      description: artigo.description,
      url: artigo.url,
      image: artigo.urlToImage,
    }));

    res.json({ sucesso: true, dados: artigos });
  } catch (error) {
    console.error("❌ Erro ao buscar notícias:", error.response?.data || error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar notícias" });
  }
});

module.exports = router;
