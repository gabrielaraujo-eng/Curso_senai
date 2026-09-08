// 1. Importar a biblioteca para ler dados do terminal
const entrada = require('readline-sync');

console.log("----------------------");
console.log("  CALCULADORA DE IMC  ");
console.log("----------------------\n");

// 2. Coleta de dados (Entrada)
const nome = entrada.question("Qual o seu nome? ");
const peso = entrada.questionFloat("Digite seu peso (ex:70.5): ");
const altura = entrada.questionFloat("Digite sua altura (ex: 1.75):");

// 3. Cauculo do IMC (Processamento)
// A formula é: peso dividido por (altura vezes altura)
const imc = peso / (altura * altura);

// 4. Exibindo do resultado (saida)
console.log("\n---------------------");
console.log(`Olá, ${nome}!`);
console.log(`Seu peso: ${peso}!`);
console.log(`Sua altura: ${altura}m`);

// O .tofixed(2) faz aparecer apenas 2 numeros depois da virgula 
console.log(`Seu IMC calculado é: ${imc.toFixed(2)}`);
console.log("----------------------");
