const entrada = require('readline-sync');

console.log("--- SISTEMA DE ANALISE DE CREDITO ---");

// Coleta de dados
const nome = entrada.question("Nome do cliente: ");
const idade = entrada.questionInt("Idade: ");
const renda = entrada.questionFloat("Renda Mensal: ");
const temImovel = entrada.keyInYNStrict("Possui imovel proprio? ");

// A Lógica Combinada
// (idade >= 18) é obrigatorio
// (renda >= 2500 || temImovel === true) um dos dois tem que ser verdade
if (idade >= 18 &&(renda >= 2500 || temImovel === true)) {
    console.log(`\nPARABENS, ${nome}! Seu credito foi aprovado!`);
} else {
    console.log(`\nSinto muito, ${nome}. Seu credito foi negado.`);
}

// && = significa "E", como o and no python, é para indentificar outra condição que DEVE ser comprida
// || = significa "OU", como o or no python, é para indentificar outra condição que PODE ser comprida
// deve seguir o modelo (c1 & (c2 || c3)) para separar como funciona
// (c1 & c2) é possivel sem tem que abrir outro parenteses
// (c1 || c2) é possivel sem tem que abrir outro parenteses
// agora para (c1 & (c2 || c3)) é necessario abrir outro parenteses para separar a condição 1 da condição 2 e 3 onde a 1 seria obrigatoria e a 2 ou 3 seria opcional mas uma delas tem que acontecer a 1 e a 2 ou 3
