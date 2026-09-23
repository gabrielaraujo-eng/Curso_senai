const entrada = require('readline-sync');

const lista = [];

for (let i = 1; i <= 5; i++) {
    const nome = entrada.question(`Digite o nome da ${i} pessoa: `);
    lista.push(nome);
}

for (let i = 0; i < lista.length; i++) {
    console.log(`${i+1} -${lista[i]}`);
}