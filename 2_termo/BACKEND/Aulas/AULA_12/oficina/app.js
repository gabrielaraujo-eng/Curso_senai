const entrada = require('readline-sync'); // import da biblioteca que permite eu pegar dados do usuario
const oficina = require('./funcoesOficina');

console.log("=== SISTEMA DE GESTÃO DE OFICINA 1.0 ===")

const peca = entrada.questionFloat("Preco da peca: R$ ");  // recebimentos dos dados do usuario
const horas = entrada.questionInt("Horas de servico: ");
const tempoUso = entrada.questionInt("Meses desde o ultimo conserto: ");

const total = oficina.calcularOrcamento(peca, horas); // calcula o total do orcamento multiplicando a hora com pecas (horas * Valorpecas)
const garantia = oficina.verificarGarantia(tempoUso); // calcula se esta dentro do limite de 3 messes retornando "esta"ou "nao esta"
const descontoValor = oficina.desconto(total);        // multiplica o total por 0.8 (que seria 20% de desconto) pré definido retornando essa multiplicação
const valorBruto = oficina.valorBrutoDesconto(total, descontoValor); // subtrai o total do orcamento com o vaor do desconto (Total-ValoDesc)

console.log("\n--- RELATORIO DE SERVICO ---");  // serie de parte de texto que o usuario enxerga
console.log(`Orcamento total:    R$ ${total.toFixed(2)}`);
console.log(`Garantia               ${garantia}`);
console.log(`Valor pos desconto: R$ ${descontoValor}`);
console.log(`Desconto:           R$ ${valorBruto.toFixed(2)}`);
console.log(`--------------------`);
console.log(` DE: R$ ${total.toFixed(2)} \n POR: R$ ${descontoValor} \n SEM: ${valorBruto.toFixed(2)} (20%)`);
console.log("--------------------");