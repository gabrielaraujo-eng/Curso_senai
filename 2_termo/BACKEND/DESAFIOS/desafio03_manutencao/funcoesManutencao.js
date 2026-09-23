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

function calcularMaoDeObra(horas, valorHora) {
    return horas * valorHora;
}

function calcularTotal(valorPecas, horas, valorHora) {
    return valorPecas + calcularMaoDeObra(horas, valorHora);
}

function classificarManutencao(total) {
    if (total <= 500) {
        return "MANUTENÇÃO DE BAIXO CUSTO";
    } else if (total <= 1500) {
        return "MANUTENÇÃO DE MÉDIO CUSTO";
    } else {
        return "MANUTENÇÃO DE ALTO CUSTO";
    }
}

module.exports = {
    calcularMaoDeObra,
    calcularTotal,
    classificarManutencao
};