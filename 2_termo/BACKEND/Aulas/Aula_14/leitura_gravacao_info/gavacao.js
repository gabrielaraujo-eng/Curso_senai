const fs = require ('fs')

console.log("=== SISTEMA DE PERCISTENCIA DE DADOS ===")

const maquinasIndustriais = [
    {id: 101, nome: "Furadeira de Bancada", setor: "Usinagem", operacial: true},
    {id: 102, nome: "Prensa de Hidraulica 40T", setor: "Estamparia", operacial: false},
    {id: 103, nome: "Torno automatico", setor: "Usinagem", operacial: true}
]
const dadosParaGravar = JSON.stringify(maquinasIndustriais, null, 2)

const nomeDoArquivo = "maquinas.json"
fs.writeFileSync(nomeDoArquivo, dadosParaGravar)

console.log(`\nGravacao concluida com sucesso`)
console.log(`Verifique o arquivo '${nomeDoArquivo}' gerado na pasta`)
