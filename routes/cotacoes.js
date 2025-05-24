const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = "cur_live_JUMhXvgYBP8TxMfUONEzTzkwvzmCC995Rsanlq8B"; // use variável de ambiente se quiser segurança

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.currencyapi.com/v3/latest", {
      params: {
        base_currency: "BRL",
        currencies: "USD,EUR,BTC,GBP,JPY,CHF,CAD,AUD,CNY,ARS,CLP,MXN,TRY"
      },
      headers: {
        apikey: API_KEY
      }
    });

    res.json({ sucesso: true, dados: response.data.data });
  } catch (error) {
    console.error("❌ Erro ao buscar cotações:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar cotações" });
  }
});

module.exports = router;
