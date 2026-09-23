// ☐ Criar um acumulador iniciado em zero.
// ☐ Usar um laço for para solicitar exatamente 6 valores.
// ☐ Somar cada valor ao acumulador.
// ☐ Ao final, calcular a média.
// ☐ Exibir total e média.
// ☐ Não repetir manualmente seis comandos de entrada.
const entrada = require("readline-sync");
let acumulador = 0;

for (let i = 1; i <= 6; i++){
    const peca = entrada.questionFloat(`Digite o valor da peca ${i}: `);
    acumulador += peca;
}

const media = acumulador/6;
console.log(`O total de pecas com defeito é ${acumulador}, a media é ${media}`);