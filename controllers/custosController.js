const { getAuth } = require("@clerk/express");
const db = require("../db/conexao");

// 💾 POST /custos
exports.calcularCustos = async (req, res) => {
  const { userId } = getAuth(req); // 👈 Obtém o ID do usuário autenticado

  try {
    const {
      produto_id, md, mod, cif,
      qtdProduzida, qtdVendida,
      precoVenda, impostos, despesas
    } = req.body;

    const custoDireto = md + mod;
    const cpp = custoDireto + cif;
    const custoUnitario = qtdProduzida > 0 ? cpp / qtdProduzida : 0;
    const cpv = custoUnitario * qtdVendida;
    const estoqueFinal = custoUnitario * (qtdProduzida - qtdVendida);
    const receitaBruta = qtdVendida * precoVenda;
    const impostosValor = receitaBruta * (impostos / 100);
    const receitaLiquida = receitaBruta - impostosValor;
    const lucroLiquido = receitaLiquida - cpv - despesas;
    const margemContribuicao = receitaLiquida - cpv;
    const margemPercentual = receitaLiquida > 0 ? (margemContribuicao / receitaLiquida) * 100 : null;
    const pontoEquilibrioUnidades = (precoVenda - custoUnitario) > 0
      ? despesas / (precoVenda - custoUnitario)
      : null;
    const pontoEquilibrioReais = pontoEquilibrioUnidades !== null
      ? pontoEquilibrioUnidades * precoVenda
      : null;

    const dataCalculo = new Date();

    // 💡 Adiciona o user_id no INSERT
    await db.query(`
      INSERT INTO calculos_custos (
        produto_id, user_id, md, \`mod\`, cif, qtd_produzida, qtd_vendida,
        preco_venda, impostos_percentual, despesas, custo_direto, cpp,
        custo_unitario, cpv, estoque_final, receita_bruta,
        impostos_valor, receita_liquida, lucro_liquido,
        margem_contribuicao, margem_percentual,
        ponto_equilibrio_unidades, ponto_equilibrio_reais,
        data_calculo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      produto_id, userId, md, mod, cif, qtdProduzida, qtdVendida,
      precoVenda, impostos, despesas, custoDireto, cpp,
      custoUnitario, cpv, estoqueFinal, receitaBruta,
      impostosValor, receitaLiquida, lucroLiquido,
      margemContribuicao, margemPercentual,
      pontoEquilibrioUnidades, pontoEquilibrioReais,
      dataCalculo
    ]);

    res.json({ sucesso: true });
  } catch (error) {
    console.error("❌ ERRO AO SALVAR NO BANCO:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao calcular e salvar os custos." });
  }
};


// 🗑️ DELETE /custos/:id
exports.excluirCalculo = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM calculos_custos WHERE id = ?", [id]);
    res.json({ sucesso: true });
  } catch (error) {
    console.error("❌ Erro ao excluir cálculo:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao excluir cálculo." });
  }
};

// 🔍 POST /custos/ultimo
exports.buscarUltimoCusto = async (req, res) => {
  const { produto_id } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM calculos_custos WHERE produto_id = ? ORDER BY id DESC LIMIT 1",
      [produto_id]
    );
    res.json({ sucesso: true, dados: rows[0] || null });
  } catch (error) {
    console.error("❌ Erro ao buscar último custo:", error.message);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar último custo." });
  }
};
