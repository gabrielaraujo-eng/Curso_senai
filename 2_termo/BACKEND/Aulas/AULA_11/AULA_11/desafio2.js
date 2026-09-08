const entrada = require('readline-sync');

const valorConta = entrada.questionFloat("Qual o valor total da sua conta?: ");

if (valorConta > 100) {
    let desconto = (valorConta * 0,9);
    console.log(`Valor com 10% de desconto: ${desconto}`)
} else {
    console.log(`${valorConta}`)
}