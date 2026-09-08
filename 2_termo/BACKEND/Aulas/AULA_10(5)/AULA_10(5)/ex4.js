// importa a readline-sync uma biblioteca que permite receber dados do usuario
const entrada = require('readline-sync');
// imprime tudo dentro das ""(aspas) no terminal 
console.log("=== REGISTRO DE TEMPERATURA ===");
// criação de lista vazia "temperatura"
const temperaturas = [];
// entrada "quantidade" entrada de valor numero inteiro.
const quantidade = entrada.questionInt("Quantas temperaturas deseja registrar?");

// loop onde a entrada "quantidade" define quantas vezes o loop vai reiniciar
// tudo dentro do () que esta dentro do for | => for () tudo dentro disso vai definir sobre o loop, nesse caso tem 3 "coisas": 
// 1- let i= 0 |define que o i vai começar no zero e o let mostra que o valor vai mudar durate o programa
// 2- i < quantidade | define que o loop só vai se iniciar caso o i for menor que a variavel "quantidade" 
// 3- i++ | define que a cada "rodada" do loop vai ser somado 1 na variavel i 
for (let i= 0; i < quantidade; i++) { // <== i++ por default soma 1 ao i, poderia tambem por i+=1 
    let temperatura = entrada.questionFloat(`Temperatura ${i+1}: `) // cria variavel temperatura onde recebe dados FLOAT (pontoflutuante(decimal)) do usuario e => o ${1+1} vai exibir a varivel i criada no for somada a 1 porque nao faz sentido começar com a "temperatura 0: "
    temperaturas.push(temperatura) // const.push(let) | const é a minha lista e let é a entrada do usuario na variavel "temperatura"
}
console.log("\n--- RELATORIO ---") // imprime tudo dentro das aspas no terminal
console.log(temperaturas) // imprime a varivel temperaturas que é a lista de temperaura
console.log(`Temperaturas registradas: ${temperaturas.join(" °C | ")} °C`) // temperaturas.join junta os valores da lista com tudo que esta dentro do ()

//mini desafio: 
//1. mostrar a quantidade de registro
//2. mostrar a primeira temperatura  
//3. mostrar a ultima temperatura

const maior = Math.max(...temperaturas) // Math.max() retorna o maior valor de uma lista, o ... é o operador spread que transforma a lista em valores separados
console.log("Quantidade de registro:")
console.log(temperaturas.length)
console.log("\nPrimeira temperatura:")
console.log(temperaturas[0])
console.log("\nUltima temperatura:")
console.log(temperaturas[temperaturas.length -1])
console.log(`Maior temperatura: ${maior}`)