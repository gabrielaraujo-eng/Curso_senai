// Contexto: Uma célula de manufatura automatizada precisa registrar os parâmetros de 3 sensores de temperatura e
// pressão instalados em um reator.
// Requisitos:
// Criar arquivo exercicio1_sensores.js.
// Definir array com 3 objetos contendo: codigo (inteiro), tipo ("Temperatura" / "Pressão"), leituraAtual
// (decimal) e status ("Operando" / "Alerta").
// Converter com indentação de 2 espaços e gravar fisicamente em sensores.json.
// Exibir mensagem de sucesso no terminal ao finalizar.

const fs = require('fs');
console.log("=== SISTEMA DE PERSISTÊNCIA: REGISTRO DE SENSORES ===");
// 1. Definição da estrutura de dados em memória (Array de Objetos)

const sensoresTemperatura = [
  { id: 1, tipo: "Temperatura", leituraAtual: 23.04, status: "Operando" },
  { id: 2, tipo: "Pressão", leituraAtual: 40.4, status: "Alerta" },
  { id: 3, tipo: "Temperatura", leituraAtual: 2.04, status: "Operando" }
];

const dadosParaGravar = JSON.stringify(sensoresTemperatura, null, 2);

const nomeDoArquivo = "sensores.json";
fs.writeFileSync(nomeDoArquivo, dadosParaGravar);

console.log(`\nGravação concluída com sucesso.`);
console.log(`Verifique o arquivo '${nomeDoArquivo}' gerado na barra lateral do VS Code.`);
