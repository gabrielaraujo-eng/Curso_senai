const entrada = require('readline-sync');

const alcool = entrada.questionFloat("Qual o preco do alcool?: ");
const gasolina = entrada.questionFloat("Qual o preco da gasolina?: ");

const proporcao = alcool / gasolina;

if (proporcao < 0.7) {
     console.log("Abasteça com ÁLCOOL");
} else {
    console.log("Abasteça com GASOLINA");
}
