const entrada = require('readline-sync');

let medida = 0

for (let i = 1; i <= 5; i++) {
    medida += entrada.questionFloat(`Digite a ${i} medida: `)
}

const media = medida / 5
console.log(`A soma das medidas é: ${medida}`);
console.log(`A média das medidas é: ${media}`);
