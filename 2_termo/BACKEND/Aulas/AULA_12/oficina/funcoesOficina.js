// função que calucula o orçamento com base em um valor de hora pré definido
function calcularOrcamento(precoPeca, horasTrabalho) {
    const valorHora = 85.00;
    const totalMaoDeObra = horasTrabalho * valorHora;

    return  precoPeca + totalMaoDeObra;
    
};
// função que decide se esta dentro ou nao da garantia
function verificarGarantia(meses) {
    if (meses <= 3) {
        return "Dentro da Garantia";
    } else {
        return "Fora da Garantia";
    }
};
// para o desconto criamos uma nova função
function desconto(calcularOrcamento) {
    return calcularOrcamento * 0.8
};
// valor bruto do desconto que pega o valor de 2 funções para calcula apenas o desconto
function valorBrutoDesconto(calcularOrcamento, desconto) {
    return calcularOrcamento - desconto
};
// modulo que permite eu exportar as minhas funcoes para outros arquivos na mesma pasta
module.exports = {
    calcularOrcamento,
    verificarGarantia,
    desconto,
    valorBrutoDesconto
};