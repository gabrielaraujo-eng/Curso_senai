// 1. Criando as caixas (variaveis)
const nomePadaria = "Padaria do SENAI"; //texto
const nomeProduto = "Pão de Queijo"; //texto
let precoUnitario = 2.50;          // Número (decimal)
let quantidadeVendida = 10;      // Numero (inteiro)

//2. Fazendo a conta 
let valortotal = precoUnitario * quantidadeVendida;

//3. Mostrando o resultado
console.log(`Bem vindo à ${nomePadaria}!`);
console.log(`Produto: ${nomeProduto}`);
console.log(`A quantidade soliciada foi: ${quantidadeVendida}`);
console.log(`O valor da sua compra foi: ${valortotal}!`);
