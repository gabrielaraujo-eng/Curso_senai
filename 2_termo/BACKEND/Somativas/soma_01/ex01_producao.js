const entrada = require('readline-sync');

const quantidade = entrada.questionFloat("Qual a quantidade de pecas por hora? ");
const hora = entrada.questionInt("Por quantas horas foram produzidas? ");
const total = hora * quantidade;

console.log(`O total de peças produzidas foi: ${total}`);