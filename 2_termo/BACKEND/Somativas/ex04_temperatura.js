const entrada = require('readline-sync');

const temperatura = entrada.questionFloat("Qual a temperatura em Celsius? ");

if (temperatura <= 60) {
    console.log(`NORMAL`)
} else if (temperatura <= 80 && temperatura > 60) {
    console.log(`ATENÇÃO`)
} else {
    console.log(`CRÍTICA`)
}

console.log(`A temperatura é: ${temperatura} °C`);