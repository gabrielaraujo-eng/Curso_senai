// Desenvolva um programa para cadastrar 5 componentes. Cada componente deverá ser representado por
// um objeto, e todos os objetos deverão ser armazenados em um array.
// Requisitos mínimos
// x☐ Criar um array vazio para armazenar os componentes.
// x☐ Cadastrar 5 componentes usando um laço de repetição.
// x☐ Para cada componente, solicitar nome, quantidade atual, estoque mínimo e valor unitário.
// x☐ Criar um objeto para cada componente e adicioná-lo ao array com push().
// ☐ Percorrer o array após o cadastro.
// x☐ Se a quantidade atual for menor que o estoque mínimo, exibir REPOR ESTOQUE; caso contrário, ESTOQUE OK.
// x☐ Criar a função calcularValorEstoque(quantidade, valorUnitario).
// x☐ Calcular o valor financeiro de cada componente em estoque.
// x☐ Calcular o valor total de todos os componentes armazenados.
// ☐ Exibir um relatório com nome, quantidade, estoque mínimo, valor unitário, valor em estoque e situação

const entrada = require('readline-sync');

const componentes = [];
let valorTotalEstoque = 0;

for (let i = 0; i < 5; i++) {
    const nome = entrada.question('Digite o nome do componente: ');
    const quantidade = entrada.questionInt('Digite a quantidade atual: ');
    const estoqueMinimo = entrada.questionInt('Digite o estoque minimo: ');
    const valorUnitario = entrada.questionFloat('Digite o valor unitario: ');
    const componente = {
        nome: nome,
        quantidade: quantidade,
        estoqueMinimo: estoqueMinimo,
        valorUnitario: valorUnitario
    };
    componentes.push(componente);
}

// for (let i = 0; i < componentes.length; i++) {
//     if (componentes[i].quantidade < componentes[i].estoqueMinimo) {
//         console.log(`${i+1} - REPOR ESTOQUE`);
//     } else {
//         console.log(`${i+1} - ESTOQUE OK`);
//     }
// }

function calcularValorEstoque(quantidade, valorUnitario) {
    return quantidade * valorUnitario;
}

console.log('=== RELATÓRIO DE COMPONENTES ===');

for (let i = 0; i < componentes.length; i++) {
    if (componentes[i].quantidade < componentes[i].estoqueMinimo) {
        console.log(`${i+1} - REPOR ESTOQUE`);
    } else {
        console.log(`${i+1} - ESTOQUE OK`);
    }
}

// for (let i = 0; i < componentes.length; i++) {
//     const valorEstoque = calcularValorEstoque(componentes[i].quantidade, componentes[i].valorUnitario);
//     valorTotalEstoque += valorEstoque;
// }

for (let i = 0; i < componentes.length; i++) {
    const valorEstoque = calcularValorEstoque(componentes[i].quantidade, componentes[i].valorUnitario);
    valorTotalEstoque += valorEstoque;
    console.log("------------------------------------------------")
    console.log(`Componente: ${componentes[i].nome}`);
    console.log(`Quantidade: ${componentes[i].quantidade}`);
    console.log(`Estoque mínimo: ${componentes[i].estoqueMinimo}`);
    console.log(`Valor unitário: ${componentes[i].valorUnitario.toFixed(2)}`);
    console.log(`Valor em estoque: ${valorEstoque.toFixed(2)}`);
    console.log("------------------------------------------------")
}

console.log(`Valor total em estoque: ${valorTotalEstoque.toFixed(2)}`);
