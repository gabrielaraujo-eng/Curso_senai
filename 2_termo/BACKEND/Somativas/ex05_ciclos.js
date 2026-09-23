const entrada = require('readline-sync');

const pecas = entrada.questionInt("Quantas pecas a maquina produz por ciclo? ");

for (let i = 1; i <= 10; i++) {
    const total = pecas * i;
    console.log(`O total de peças produzidas em ${i} ciclos é: ${total}`);
}