const entrada = require('readline-sync');
const oficina = require('./funcoesOficina');

console.log("=== SISTEMA DE GESTÃO DE OFICINA 1.0 ===")

const peca = entrada.questionFloat("Preco da peca: R$ ");
const horas = entrada.questionInt("Horas de servico: ");
const tempoUso = entrada.questionInt("Meses desde o ultimo conserto: ");

const total = oficina.calcularOrcamento(peca, horas);
const garantia = oficina.verificarGarantia(tempoUso);
const descontoValor = oficina.desconto(total);
const valorBruto = oficina.valorBrutoDesconto(total, descontoValor);

console.log("\n--- RELATORIO DE SERVICO ---");
console.log(`Orcamento total: R$ ${total.toFixed(2)}`);
console.log(`Garantia            ${garantia}`);
console.log(`Desconto:        R$ ${descontoValor}`);
console.log(`Valor que voce deixou de gastar!: ${valorBruto.toFixed(2)} \n`);
console.log(`--------------------`);
console.log(` DE: R$ ${total.toFixed(2)} \n POR: R$ ${descontoValor} \n SEM: ${valorBruto.toFixed(2)} (20%)`);
console.log("--------------------");