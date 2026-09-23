function calcularMaoDeObra(horas) {
    const valorHora = 80;
    const totalMaoDeObra = horas * valorHora;
    return totalMaoDeObra;
}

function calcularTotal(valorPecas, horas) {
    const total = valorPecas + calcularMaoDeObra(horas);
    return total;
}

function verificarGarantia(meses) {
    if (meses <= 6) {
        return "EM GARANTIA";
    } else {
        return "FORA DE GARANTIA";
    }
}

module.exports = {
    calcularMaoDeObra,
    calcularTotal,
    verificarGarantia
}