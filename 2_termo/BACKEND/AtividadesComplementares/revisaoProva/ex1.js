// ☐ Solicitar a temperatura pelo terminal.
// ☐ Até 60 °C: exibir NORMAL.
// ☐ De 61 °C até 80 °C: exibir ATENÇÃO.
// ☐ Acima de 80 °C: exibir CRÍTICA.
// ☐ Exibir também a temperatura informada.
// ☐ Testar obrigatoriamente com 60, 61, 80 e 81 °C.
const entrada = require("readline-sync")

console.log("Verificador de temperatura")
const temperatura = entrada.questionFloat("Qual a temperatura?: ")

if (temperatura <= 60) {
    console.log("NORMAl ")
} else if (temperatura <= 80 && temperatura >= 61) {
    console.log("ATENCAO ")
} else {
    console.log("CRITICA ")
}
console.log(`A temperatura informada foi ${temperatura}`)