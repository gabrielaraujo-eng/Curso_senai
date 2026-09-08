const entrada = require('readline-sync');

const idade = entrada.questionInt("Qual a idade?: ")

if (idade >= 5 && idade <= 10) {
    console.log("Categoria: Infantil");
} else if (idade >= 11 && idade <= 17) {
    console.log("Categoria: Juvenil");
} else if (idade >= 18 && idade <= 60) {
    console.log("Categoria: Adulto");
} else if (idade > 60) {
    console.log("Categoria: Sênior");
} else {
    console.log("Idade inválida");
}