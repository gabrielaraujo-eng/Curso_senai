// Exercício 2: Cadastro de Ferramental com Entrada Dinâmica
// Contexto: A ferramentaria precisa registrar ferramentas manuais interativamente pelo terminal e consolidar o lote no
// disco.
// Requisitos:
// xCriar arquivo exercicio2_ferramentas.js e utilizar a biblioteca readline-sync.
// xPerguntar quantas ferramentas serão registradas e iterar via laço for.
// xPara cada ferramenta, solicitar: nome (string), quantidade (inteiro) e custoUnitario (float), inserindo no array
// via .push().
// Persistir os dados em ferramentas.json e exibir confirmação com contagem de itens.

const fs = require('fs');
const entrada = require('readline-sync')

const ferramenta = entrada.questionInt("Quantas ferramentas serao registradas?: ")
const ferramentas = []

for (let i = 0; i < ferramenta; i++) {
    const nome = entrada.question("Digite o nome da ferramenta: ")
    const quantidade = entrada.questionInt("Digite a quantidade: ")
    const custoUnitario = entrada.questionFloat("Digite o custo unitario: ")
    const ferramentaObj = {
        nome: nome,
        quantidade: quantidade,
        custoUnitario: custoUnitario
    }
    ferramentas.push(ferramentaObj)
}


console.log("=== SISTEMA DE PERSISTÊNCIA: REGISTRO DE FERRAMENTAS ===");

const dadosParaGravar = JSON.stringify(ferramentas, null, 2);

const nomeDoArquivo = "ferramentas.json";
fs.writeFileSync(nomeDoArquivo, dadosParaGravar);

console.log(`\nGravação concluída com sucesso.`);
console.log(`Verifique o arquivo '${nomeDoArquivo}' gerado na barra lateral do VS Code. ${ferramentas.length} ferramentas foram registradas. `);