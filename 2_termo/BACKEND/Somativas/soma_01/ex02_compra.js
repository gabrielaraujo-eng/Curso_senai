const entrada = require('readline-sync');

const material =entrada.question("Qual o nome do material? ");
const quantidade = entrada.questionFloat("Qual a quantidade de pecas comprada? ");
const valor = entrada.questionFloat("Qual o valor unitario do material? ");
const total = quantidade * valor;

console.log(`---RELATORIO DE COMPRA---`);
console.log(`Material: ${material}`);
console.log(`Quantidade: ${quantidade}`);
console.log(`Valor Unitário: ${valor}`);
console.log(`Total: ${total.toFixed(2)}`);