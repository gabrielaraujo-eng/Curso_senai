// Criando a "maquina" de calcular media
const entrada = require("readline-sync") 
function calcularMedia(n1, n2) {
    return (n1 + n2) / 2;
}

//Usando a maquina
const numero1 = entrada.questionInt("Qual sua nota 1? ")
const numero2 = entrada.questionInt("Qual sua nota 2? ")
const resultado = calcularMedia(numero1, numero2)
console.log(`A media calcular foi: ${resultado}`)