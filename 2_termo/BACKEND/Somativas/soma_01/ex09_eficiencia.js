const entrada = require('readline-sync');

function calcularEficiencia(real, prevista) {
    const eficiencia = (real / prevista) * 100;
    return eficiencia;
}

function classificarEficiencia(percentual) {
    if (percentual >= 90) {
        return "META ATINGIDA";
    } else if (percentual >= 70 && percentual <= 89.99) {
        return "ATENCAO";
    } else {
        return "ABAIXO DA META";
    }
}

const producaoPrevista = entrada.questionFloat("Digite a producao prevista: ");
const producaoReal = entrada.questionFloat("Digite a producao real: ");


const percentual = calcularEficiencia(producaoReal, producaoPrevista);
const classificacao = classificarEficiencia(percentual);

console.log(`Producao prevista: ${producaoPrevista}`);
console.log(`Producao real: ${producaoReal}`);
console.log(`Percentual: ${percentual.toFixed(2)}%`);
console.log(`Classificacao: ${classificacao}`);

