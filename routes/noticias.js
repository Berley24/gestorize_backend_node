const express = require("express");
const axios = require("axios");
const router = express.Router();

const GNEWS_KEY = process.env.GNEWS_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "finanças",
        lang: "pt",
        country: "br",
        max: 10,
        apikey: GNEWS_KEY
      }
    });

    res.json({ sucesso: true, dados: response.data.articles });
  } catch (error) {
    console.error("❌ Erro ao buscar notícias GNews:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar notícias" });
  }
});

module.exports = router;
