const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resposta = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "finanças OR economia OR investimentos OR empreendedorismo OR renda extra OR gestão financeira OR negócios OR educação financeira OR planejamento financeiro OR saúde financeira OR mentalidade financeira OR organização financeira OR orçamento OR dívidas OR CNPJ OR MEI OR lucros OR startup OR inovação OR produtividade",
        language: "pt",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const noticias = resposta.data.articles.map(noticia => ({
      title: noticia.title,
      description: noticia.description,
      url: noticia.url,
      image: noticia.urlToImage
    }));

    res.json({ sucesso: true, dados: noticias });
  } catch (error) {
    console.error("❌ Erro ao buscar notícias:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar notícias" });
  }
});

module.exports = router;
