const entrada = require('readline-sync');

const renda = entrada.questionFloat("Digite sua renda mensal (R$): ");
const nome =  entrada.question("Seu nome esta limpo? (s/n): ");

if (nome == "s") {
    nomeLimpo = true
} else {
    nomeLimpo = false
}

if (renda > 2000 && nomeLimpo) {
    console.log("Empréstimo Aprovado");
} else {
    console.log("Empréstimo Negado");
}

