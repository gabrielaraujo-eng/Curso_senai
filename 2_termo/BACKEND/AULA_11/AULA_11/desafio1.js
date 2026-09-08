const entrada = require('readline-sync')

const nome = entrada.question("Qual seu nome?: ")
const anoUsuario = entrada.questionInt("Qual seu ano de nascimento?: ")

const idade = 2026 - anoUsuario

if (idade >= 16) {
    console.log(`${nome}, voce tem idade minima para votar!`)
} else {
    console.log(`${nome},  voce nao tem idade suficiente para votar`)
}

