const entrada = require('readline-sync');

const nome = entrada.question("Digite seu nome: ");
const nascimento = entrada.questionInt("qual seu ano de nascimento: ");
const ano_atual = 2026;

const idade = ano_atual - nascimento;

if (idade >=16) {   
    console.log("Voce pode votar");
} else {
    console.log("Voce nao pode votar");
}