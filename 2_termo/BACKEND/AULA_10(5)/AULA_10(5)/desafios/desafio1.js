//1 primeira versão sem estrutura
// const entrada = require('readline-sync');

// console.log("=== SISTEMA DE CONTROLE DE QUALIDADE ===");

// const pesos = [];
// let somatotal = 0;
// const quantidade = entrada.questionInt("quantas pecas serao avaliadas? ");

// for(let i= 0; i < quantidade; i++) {
//     let peso = entrada.questionFloat(`Digite o peso da peca ${i+1}: `)
//     pesos.push(peso)
//     somatotal += peso
// };
// const media = somatotal/quantidade

// console.log("\n--- RELATORIO DA AUDITORIA ---");
// console.log(`pesos registrados: ${pesos}`);
// console.log(`Pesos registrados: ${pesos.join(" KG |")} KG`);
// console.log(`A media do lote é ${media} KG`)

// if (media >= 4.8 && media <= 5.2) {
//     console.log("LOTE APROVADO!")
// } else {
//     console.log("LOTE REPROVADO!")
// }

const entrada = require('readline-sync');

console.log("=== SISTEMA DE CONTROLE DE QUALIDADE ===\n");

const pesos = [];
let somatotal = 0;

const quantidade = entrada.questionInt("quantas pecas serao avaliadas? \n");

for(let i= 0; i < quantidade; i++) {
    let peso = entrada.questionFloat(`Digite o peso da peca ${i+1}: `)
    pesos.push(peso)
    somatotal += peso
};

const media = somatotal/quantidade;
const max = Math.max(...pesos);
const min = Math.min(...pesos);
const peso_ideal = 5.2 - media

console.log("\n--- RELATORIO DA AUDITORIA ---");
console.log(`Pesos registrados: ${pesos.join(" KG |")} KG`);
console.log(`A media do lote é ${media} KG`);

if (media >= 4.8 && media <= 5.2) {
    console.log("\nLOTE APROVADO!\n")
} else {
    console.log("\nLOTE REPROVADO!\n")
};

console.log(`Maior peso registrado: ${max}`);
console.log(`Menor peso registrado: ${min}`)
console.log(`Quantidade de pecas avaliadas: ${pesos.length}`)
console.log(`O lote ficou ${peso_ideal.toFixed(2)} KG abaixo do peso ideal.`)
