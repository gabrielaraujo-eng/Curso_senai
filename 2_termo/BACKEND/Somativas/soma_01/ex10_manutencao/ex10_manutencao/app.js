const entrada = require('readline-sync');
const funcoes = require('./funcoesManutencao');

const nome = entrada.question("Digite o nome da maquina: ");
const valorPecas = entrada.questionFloat("Digite o valor das pecas: ");
const horasServico = entrada.questionInt("Digite a quantidade de horas de servico: ");
const mesesUltimaManutencao = entrada.questionInt("Digite a quantidade de meses desde a ultima manutencao: ");

const valorPecasCalculado = funcoes.calcularTotal(valorPecas, horasServico);
const manutencaoNecessaria = funcoes.verificarGarantia(mesesUltimaManutencao);
const maoDeObra = funcoes.calcularMaoDeObra(horasServico);

console.log(`---RELATORIO DE MANUTENCAO---`);
console.log(`Nome da maquina: ${nome}`);
console.log(`Valor total: ${valorPecasCalculado.toFixed(2)}`);
console.log(`Mao de obra: ${maoDeObra.toFixed(2)}`);
console.log(`Manutencao necessaria: ${manutencaoNecessaria}`);