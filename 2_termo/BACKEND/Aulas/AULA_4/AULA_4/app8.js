const entrada = require('readline-sync');

console.log("=~= Sistema de Multa =~=")

const nome = entrada.question("Digite seu nome: ");
const velocidade = entrada.questionFloat("qual sua velocidade?" );

if (velocidade > 80 ) {
    console.log(`\nA velocidade é ${velocidade}km/h`);    
    console.log(`Multado! por alta velocidade ${nome}`);
} else {
    console.log(`\nA velocidade é ${velocidade}km/h`);
    console.log(`Continue sua viagem! ${nome}`);
}