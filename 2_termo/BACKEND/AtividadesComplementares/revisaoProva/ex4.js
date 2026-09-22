// Um almoxarifado precisa cadastrar 4 materiais. Cada material possui nome, quantidade atual e estoque
// mínimo. Ao final, o programa deve indicar quais precisam de reposição.
// O programa deve:
// ☐ Criar um array vazio.
// ☐ Usar um laço para cadastrar 4 materiais.
// ☐ Criar um objeto em cada repetição com nome, quantidade e estoqueMinimo.
// ☐ Adicionar cada objeto ao array com push().
// ☐ Depois do cadastro, percorrer o array.
// ☐ Se quantidade < estoqueMinimo, exibir REPOR ESTOQUE; caso contrário, ESTOQUE OK.
// ☐ Exibir nome, quantidade, estoque mínimo e situação.
const entrada = require("readline-sync");
const materiais = [];

for (let i = 0; i <= 3; i++) {
    const material = {
        nome: entrada.question(`Digite o nome do produto ${i+1}: `),
        quantidade: entrada.questionInt(`Digite a quantidade do produto${i+1}: `),
        estoqueMinimo: entrada.questionInt(`Digite o estoque minimo ${i+1}: `)
    }
    materiais.push(material)
}

console.log("--- RELATORIO DE ESTOQUE ---")

for (let i = 0; i < materiais.length; i++) {
    const produto = materiais[i];

    let situacao;
    if (produto.quantidade < produto.estoqueMinimo) {
        situacao = "REPOR ESTOQUE"
    } else {
        situacao = "ESTOQUE OK"
    }

    console.log(`Material: ${produto.nome}`)
    console.log(`Quantidade: ${produto.quantidade}`)
    console.log(`Estoque minimo: ${produto.estoqueMinimo}`)
    console.log(`Situacao: ${situacao}`)
    console.log("-".repeat(20))
}