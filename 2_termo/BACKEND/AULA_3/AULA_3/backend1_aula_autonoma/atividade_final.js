const readline = require("readline-sync");
const nome = readline.question("Digite o nome do aluno: ");
const disciplina = readline.question("Digite a disciplina: ");
const nota1 = Number(readline.question("Digite a primeira nota: "));
const nota2 = Number(readline.question("Digite a segunda nota: "));
const faltas = Number(readline.question("Digite a quantidade de faltas: "));

const media = (nota1 + nota2) / 2;

const nome_turma = readline.question("Digite o nome da sua turma: ");
const nome_escola = readline.question("Digite o nome da sua escola: ");
const periodo = Number(readline.question("Digite o periodo (ex: 9): "));
const idade = Number(readline.question("Digite sua idade: "));
const carga_horaria = Number(readline.question("Digite a carga horaria da diciplina (ex: 3): "));
const cidade = readline.question("Digite sua cidade: ");
const ano_letivo = Number(readline.question("Digite o ano letivo que se encontra: "));

console.log("\n--- RELATÓRIO DO ALUNO ---");
console.log("Aluno:", nome);
console.log("Disciplina:", disciplina);
console.log("Nota 1:", nota1);
console.log("Nota 2:", nota2);
console.log("Média:", media);
console.log("Faltas:", faltas);
console.log("Turma:", nome_turma);
console.log("Escola:",nome_escola);
console.log("Periodo:", periodo);
console.log("Idade:",idade);
console.log("Carga horaria:",carga_horaria);
console.log("cidade:",cidade);
console.log("Ano letivo:",ano_letivo);