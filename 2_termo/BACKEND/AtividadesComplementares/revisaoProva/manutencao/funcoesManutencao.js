function calcularMaoDeObra(horas) {
    const valorHora = 80
    return horas * valorHora
}

function calcularTotal(valorPecas, horas) {
    return valorPecas + calcularMaoDeObra(horas)
}

function verificarGarantia(meses) {
    if (meses <= 6) {
        return "EM GARANTIA"
    } else {
        return "FORA DE GARANTIA"
    }
}
module.exports = {
    calcularMaoDeObra,
    calcularTotal,
    verificarGarantia
}