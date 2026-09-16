const entrada = require('readline-sync');

const produto = entrada.question("Qual o nome do produto? ");
const qtdPorHora = entrada.questionFloat("Qual a quantidade de peças produzidas por hora? ");
const horas = entrada.questionInt("Por quantas horas foram produzidas? ");

const prodDiaria = qtdPorHora * horas;

console.log("=== RELATORIO DE PRODUÇÃO ===");
console.log(`Produto: ${produto}`);
console.log(`Quantidade produzida por hora: ${qtdPorHora}`);
console.log(`Horas trabalhadas: ${horas}`);
console.log(`Produção diária: ${prodDiaria}`);