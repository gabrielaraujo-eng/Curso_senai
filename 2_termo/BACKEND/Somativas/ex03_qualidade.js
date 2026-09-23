const entrada = require('readline-sync');

const peso = entrada.questionFloat("Qual o peso do produto (em g)? ");

if (peso <= 105 && peso >= 95) {
    console.log(`PEÇA APROVADA`)
} else {
    console.log(`PEÇA REPROVADA`)
}

console.log(`O peso do produto é: ${peso} g`);