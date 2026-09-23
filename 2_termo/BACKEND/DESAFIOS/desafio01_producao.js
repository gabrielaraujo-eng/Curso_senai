// Desenvolva um programa que solicite o nome da máquina e registre a produção de 5 horas de trabalho.
// Cada valor de produção deverá ser armazenado em um array. Ao final, o sistema deverá apresentar um
// relatório do turno.
// Requisitos mínimos
// x☐ Solicitar o nome da máquina.
// x☐ Usar um laço de repetição para receber a produção de cada uma das 5 horas.
// x☐ Armazenar todas as produções em um array.
// ☐ Calcular a produção total do turno.
// x☐ Calcular a média de produção por hora.
// x☐ Identificar a maior produção registrada entre as 5 horas.
// x☐ Considerar uma meta de 500 peças no turno.
// x☐ Exibir META ATINGIDA quando o total for maior ou igual a 500; caso contrário, exibir META NÃO ATINGIDA.
// x☐ Criar uma função calcularMedia(total, quantidadeHoras) e utilizar seu retorno no relatório.

const entrada = require('readline-sync')

function calcularMedia(total, quantidadeHoras) {
    return total / quantidadeHoras;
}

const nomeMaquina = entrada.question('Digite o nome da maquina: ')
const producaoTotal = []
let producaoAcumulada = 0
let maiorProducao = 0
const meta = 500

for (let i = 0; i < 5; i++) {
    const producao = entrada.questionFloat(`Qual a producao de pacas na hora ${i+1}: `)
    producaoTotal.push(producao) 
    producaoAcumulada += producao
}

for (let i = 0; i < producaoTotal.length; i++) {
    if (producaoTotal[i] > maiorProducao) {
        maiorProducao = producaoTotal[i]
    }
}





console.log("=== RELATÓRIO DE PRODUÇÃO ===")
console.log(`Máquina: ${nomeMaquina}`)
console.log(`Produção total: ${producaoAcumulada}`)
console.log(`Média de produção por hora: ${calcularMedia(producaoAcumulada, 5)}`)
console.log(`Maior producao do dia: ${maiorProducao}`)

if (producaoTotal >= meta) {
    console.log(`META ATINGIDA`)
} else {
    console.log(`META NÃO ATINGIDA`)
}