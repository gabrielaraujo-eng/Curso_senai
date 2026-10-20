// PROJETO DO ALUNO - complete as funções abaixo.
// Execute com: npm start
const fs = require('node:fs');
const caminho = require('node:path');
const ARQUIVO = caminho.join(__dirname, 'maquinas.json');

function carregarMaquinas() {
const texto = fs.readFileSync(ARQUIVO,'utf8');
const maquinas = JSON.parse(texto);
return maquinas;
}

function listarMaquinas(maquinas) {
  maquinas.forEach(maquina => {
  console.log(maquina.id + ' - ' + maquina.nome +
' - ' + maquina.status);
});
}


function buscarPorId(maquinas, id) {
return maquinas.find(maquina => maquina.id === id);
}

function filtrarPorStatus(maquinas, status) {
return maquinas.filter(maquina => maquina.status === status);
}

function filtrarPorSetor(maquinas, setor) {
return maquinas.filter(maquina => maquina.setor === setor);
}

function executar() {
  console.log('Sistema de consultas industriais - CRUD READ');
  const maquinas = carregarMaquinas();
  listarMaquinas(maquinas);
  console.log('\nBusca por ID 3:');
  console.log(buscarPorId(maquinas, 3));
  console.log('Busca por ID 99:');
  console.log(buscarPorId(maquinas, 99));
  console.log('Maquinas em manutencao:');
  console.log(filtrarPorStatus(maquinas, 'manutencao'));
}

if (require.main === module) executar();
module.exports = { carregarMaquinas, listarMaquinas, buscarPorId, filtrarPorStatus, filtrarPorSetor };

