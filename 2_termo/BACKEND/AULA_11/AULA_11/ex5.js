const entrada = require('readline-sync')

// Função que calcula 15% de desconto
function calcularDesconto(precoOriginal) {
    return precoOriginal * 0.85; // Retorna 85% do valor (ou seja, 15% de desconto)
}

const produtos = ["Monitor", "Teclado", "Mouse"];
const precos = [800, 150, 80]

console.log("=== TABELA DE PRECOS COM DESCONTO (15%) ===")

for (let i = 0; i < produtos.length; i++) {
    // Usamos a mesma função para cada item do array!
    let precoComDesconto = calcularDesconto(precos[i]);

    console.log(`${produtos[i]}: de R${precos[i]} por R$ ${precoComDesconto.toFixed(2)}`);
}

// function calcularDescontoGlobal(precoOriginal, desconto) {
//     return precoOriginal * desconto;
// }

// const produtos = ["Monitor", "Teclado", "Mouse"];
// const precos = [800, 150, 80]

// console.log("=== TABELA DE PRECOS COM DESCONTO ===")

// for (let i = 0; i < produtos.length; i++) {
//     // Usamos a mesma função para cada item do array!
//     let desconto = entrada.questionFloat(`Qual o desconto atual ${i+1}: `)
//     let precoComDesconto = calcularDescontoGlobal(precos[i], desconto);

//     console.log(`${produtos[i]}: de R${precos[i]} por R$ ${precoComDesconto.toFixed(2)}`);

// }
