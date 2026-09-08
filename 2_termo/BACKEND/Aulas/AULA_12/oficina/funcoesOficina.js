function calcularOrcamento(precoPeca, horasTrabalho) {
    const valorHora = 85.00;
    const totalMaoDeObra = horasTrabalho * valorHora;

    return  precoPeca + totalMaoDeObra;
    
};

function verificarGarantia(meses) {
    if (meses <= 3) {
        return "Dentro da Garantia";
    } else {
        return "Fora da Garantia";
    }
};

function desconto(calcularOrcamento) {
    return calcularOrcamento * 0.8
};

function valorBrutoDesconto(calcularOrcamento, desconto) {
    return calcularOrcamento - desconto
};

module.exports = {
    calcularOrcamento,
    verificarGarantia,
    desconto,
    valorBrutoDesconto
};