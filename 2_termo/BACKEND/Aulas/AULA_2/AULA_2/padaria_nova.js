const entrada = require('readline-sync');

console.log("--- PADARIA 2.0: SISTEMA DE TROCO ---");

// Entradas
const cliente = entrada.question("Nome do cliente: ");
const precoPao = entrada.questionFloat("Preco do pao: ");
const qtdPao = entrada.questionInt("Quantos paes ele comprou? ");
const valorPago = entrada.questionFloat("Quanto o cliente deu em dinheiro? ");

// Processamento
const totalConta = precoPao * qtdPao;
const troco = valorPago - totalConta;

// Saída formatada
console.log("\n------------------------------");
console.log(`Cliente: ${cliente}`);
console.log(`Total da Compra: R$ ${totalConta.toFixed(2)}`);
console.log(`Valor Pago: R$ ${valorPago.toFixed(2)}`);
console.log(`TROCO A DEVOLVER: R$ ${troco.toFixed(2)}`);
console.log("------------------------------");