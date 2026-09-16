const entrada = require('readline-sync');

// Criando a "ferramenta" de conversão
function converterParaFahrenheit(celsius) {
    let fahrenheit = (celsius * 9/5) + 32;
    return fahrenheit; // Devolve o resultado para quem chamou
}

const tempC = entrada.questionFloat("Digite a temperatura em Celsius: ");

// Chamando a função e guardando o que ela "cuspiu" de volta
const tempF = converterParaFahrenheit(tempC);

console.log(`A temperatura convertida e: ${tempF.toFixed(1)} °F`);
