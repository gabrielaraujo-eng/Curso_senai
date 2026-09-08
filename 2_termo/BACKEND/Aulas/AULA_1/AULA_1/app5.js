const entrada = require('readline-sync');

console.log("-----Sistema de Vendas Padaria-----");

const nomeProduto = entrada.question("qual o nome do produto? ");
const precoUnitario = entrada.questionFloat("qual o preço unitario? ");
const quantidade = entrada.questionINt("quantas unidades foram vendidas? ");

const total = precoUnitario *  quantidade;

console.log("\n-----RECIBO DE VENDA-----");
console.log(`Produto: ${nomeProduto}`);
console.log(`Quantidade de produtos: ${quantidade}`);
console.log(`Total a pagar: R$ ${total.toFixed(2)}`);


