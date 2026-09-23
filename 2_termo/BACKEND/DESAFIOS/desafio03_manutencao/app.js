// Desenvolva a solução utilizando dois arquivos JavaScript. As funções de cálculo e classificação deverão
// ficar em um módulo separado, enquanto o programa principal será responsável por receber os dados do
// atendimento e apresentar o relatório.
// Requisitos mínimos
// x☐ Criar uma pasta chamada desafio03_manutencao.
// x☐ Dentro dela, criar funcoesManutencao.js e app.js.
// x☐ Em funcoesManutencao.js, criar calcularMaoDeObra(horas, valorHora), retornando o custo da mão de
// obra.
// x☐ Criar calcularTotal(valorPecas, horas, valorHora), retornando peças + mão de obra.
// x☐ Criar classificarManutencao(total).
// x☐ Classificação: até R$ 500,00 = MANUTENÇÃO DE BAIXO CUSTO.
// x☐ Acima de R$ 500,00 e até R$ 1.500,00 = MANUTENÇÃO DE MÉDIO CUSTO.
// x☐ Acima de R$ 1.500,00 = MANUTENÇÃO DE ALTO CUSTO.
// x☐ Exportar as funções usando module.exports.
// x☐ No app.js, importar readline-sync e o módulo com require().
// x☐ Solicitar nome da máquina, setor, valor das peças, quantidade de horas e valor da hora técnica.
// x☐ Chamar as funções do módulo utilizando os dados informados pelo usuário.
// x☐ Exibir relatório contendo máquina, setor, valor das peças, horas, valor da hora, mão de obra, custo total e
// classificação.

const entrada = require('readline-sync');
const funcoesManutencao = require('./funcoesManutencao');

const nomeMaquina = entrada.question('Digite o nome da máquina: ');
const setor = entrada.question('Digite o setor: ');
const valorPecas = entrada.questionFloat('Digite o valor das peças: ');
const horas = entrada.questionFloat('Digite a quantidade de horas: ');
const valorHora = entrada.questionFloat('Digite o valor da hora técnica: ');

const maoDeObra = funcoesManutencao.calcularMaoDeObra(horas, valorHora);
const total = funcoesManutencao.calcularTotal(valorPecas, horas, valorHora);
const classificacao = funcoesManutencao.classificarManutencao(total);

console.log('=== RELATÓRIO DE MANUTENÇÃO ===');
console.log(`Máquina: ${nomeMaquina}`);
console.log(`Setor: ${setor}`);
console.log(`Valor das peças: R$ ${valorPecas.toFixed(2)}`);
console.log(`Horas: ${horas}`);
console.log(`Valor da hora: R$ ${valorHora.toFixed(2)}`);
console.log(`Mão de obra: R$ ${maoDeObra.toFixed(2)}`);
console.log(`Custo total: R$ ${total.toFixed(2)}`);
console.log(`Classificação: ${classificacao}`);