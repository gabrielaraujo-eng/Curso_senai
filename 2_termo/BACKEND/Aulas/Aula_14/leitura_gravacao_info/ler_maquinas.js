const fs = require('fs')
console.log("=== SISTEMA DE LEITURA DE INFORMCOES ===")

const nomeDoArquivo = "maquinas.json"; 

if (!fs.existsSync(nomeDoArquivo)) {
    console.error(`Erro: O arquivo '${nomeDoArquivo}'  nao foi encontrado`);
    process.exit(1); 
}

const conteudoTexto = fs.readFileSync(nomeDoArquivo, 'utf-8')
const maquinasRecuperadas = JSON.parse(conteudoTexto)

console.log("Dados Carregados com sucesso")
console.table(maquinasRecuperadas)

console.log(`\nTotal de maquinas cadastradas: ${maquinasRecuperadas.length}`)
console.log(`Primeira maquina da lista: ${maquinasRecuperadas[0].nome}`)
