// Testes de autoavaliação: o programa mostra o que falta implementar.
const assert = require('node:assert/strict');
const { carregarMaquinas, buscarPorId, filtrarPorStatus, filtrarPorSetor } = require('./app');
function testar(nome, fn) {
  try { fn(); console.log('OK  - ' + nome); }
  catch (erro) { console.log('FALHOU - ' + nome + ': ' + erro.message); process.exitCode = 1; }
}
testar('Carregar 8 máquinas', () => {
  const dados = carregarMaquinas();
  assert.equal(Array.isArray(dados), true);
  assert.equal(dados.length, 8);
});
testar('Buscar o ID 3', () => assert.equal(buscarPorId(carregarMaquinas(), 3)?.nome, 'Esteira E-03'));
testar('ID 99 não encontrado', () => assert.equal(buscarPorId(carregarMaquinas(), 99), undefined));
testar('Filtrar manutenção (2)', () => assert.equal(filtrarPorStatus(carregarMaquinas(), 'manutencao').length, 2));
testar('Filtrar setor Usinagem (2)', () => assert.equal(filtrarPorSetor(carregarMaquinas(), 'Usinagem').length, 2));
