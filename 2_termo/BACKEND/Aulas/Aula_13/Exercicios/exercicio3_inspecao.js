// Contexto: Um inspetor de qualidade afere a espessura de 4 chapas de aço. O sistema compila as medições e valida a
// tolerância técnica do lote.
// Requisitos:
// Criar arquivo exercicio3_inspecao.js.
// Estruturar o objeto relatorioInspecao com: data ("2026-09-23"), inspetor (nome), amostras (array de 4
// números em mm) e loteAprovado (booleano).
// O lote só é aprovado se todas as medidas forem ≥ 12.0 mm.
// Converter para JSON e salvar no arquivo inspecao_qualidade.json, emitindo veredito no console.

const fs = require('fs');

const relatorioInspecao = {
    data: "2026-09-23",
    inspetor: "Carlos Silva",
    amostras: [12.5, 13.0, 12, 12.2],
    loteAprovado: false
};

for (let i = 0; i < relatorioInspecao.amostras.length; i++) {
    if (relatorioInspecao.amostras[i] <= 12.0) {
        relatorioInspecao.loteAprovado = false, "Reprovado";
        break;
    } else {
        relatorioInspecao.loteAprovado = true, "Aprovado";
    }
}

const dadosParaGravar = JSON.stringify(relatorioInspecao, null, 2);

const nomeDoArquivo = "inspecaoQualidade.json";
fs.writeFileSync(nomeDoArquivo, dadosParaGravar);

console.log(`\nGravação concluída com sucesso.`);
console.log(`Verifique o arquivo '${nomeDoArquivo}' gerado na barra lateral do VS Code.`);
console.log(`O lote foi ${relatorioInspecao.loteAprovado}.`);
