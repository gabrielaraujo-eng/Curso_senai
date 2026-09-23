const entrada = require('readline-sync');

const lista = [];

for (let i = 1; i <= 3; i++) {
    const objeto = {
        nome: entrada.question(`Digite o nome: `),
        quantidade: entrada.questionFloat(`Digite a quantidade: `),
        estoqueMinimo: entrada.questionFloat(`Digite o estoque minimo: `)
    }
    lista.push(objeto);
}

for (let i = 0; i < lista.length; i++) {
    const objeto = lista[i];
    if (objeto.quantidade < objeto.estoqueMinimo) {
        console.log(`REPOR ESTOQUE`);
    } else {
        console.log(`ESTOQUE OK`);
    }
    console.log(`Nome: ${objeto.nome}`);
}