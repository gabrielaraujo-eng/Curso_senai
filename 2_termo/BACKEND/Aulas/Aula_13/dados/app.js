const fs = require('node:fs')
const caminho = require('node:path')
const ARQUIVO = caminho.join(__dirname, 'maquinas.json')

function carregarMaquinas () {
    const conteudo = fs.readFileSync(ARQUIVO, 'utf-8');
    const maquinas = JSON.parse(conteudo);

    if(!Array.isArray(maquinas)) {
        throw new Error (`O arquivo JSON deve conter uma lista de maquinas.`);
    }
    return maquinas;
}
function listarmaquinas(maquinas) {
    maquinas.forEach((maquina) => {
        console.log(`${maquina.id} | ${maquina.nome} | ${maquina.status}`);
    });
}
function buscarPorId(maquinas, id) {
    return maquinas.find((maquina) => maquina.id === id);
}
function filtrarPorStatus(maquinas, status) {
    return maquinas.filter((maquina) => maquina.status === status);
}
function filtrarPorSetor(maquinas, setor) {
    return maquinas.filter((maquina) => maquina.setor === setor);
}
function executar() {
    try {
        const maquinas = carregarMaquinas()
        console.log(`\n=== TODAS AS MAQUINAS ===`)
        listarmaquinas(maquinas)

        console.log(`\n=== BUSCA PELO ID 3 ===`)
        console.log(buscarPorId(maquinas, 3) ?? 'Maquina nao encontrada') 

        console.log(`\n=== BUSCA PELO ID 99 ===`)
        console.log(buscarPorId(maquinas, 99) ?? 'Maquina nao encontrada') 

        console.log(`\n=== MAQUINAS EM MANUTENCAO ===`)
        console.log(buscarPorStatus(maquinas, "manutencao"))

        console.log(`\n=== MAQUINAS EM USINAGEM ===`)
        console.log(buscarPorSetor(maquinas, "Usinagem")) 
    }catch(erro) {
        process.exitCode = 1
        console.log("wefrgiegre")
    }
}
if (require.main === module) {
    executar()
}

module.exports = {
    carregarMaquinas,
    listarmaquinas,
    buscarPorId,
    filtrarPorStatus,
    filtrarPorSetor
}