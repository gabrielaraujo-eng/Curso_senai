// Importa o módulo nativo do Node.js para manipulação de arquivos
const fs = require('fs');
console.log("=== SISTEMA DE PERSISTÊNCIA: REGISTRO DE MÁQUINAS ===");
// 1. Definição da estrutura de dados em memória (Array de Objetos)
const maquinasIndustriais = [
  { id: 101, nome: "Torno Mecânico Universal", setor: "Usinagem", operacional: true },
  { id: 102, nome: "Fresadora Ferramenteira", setor: "Usinagem", operacional: false },
  { id: 103, nome: "Prensa Hidráulica 50T", setor: "Estampagem", operacional: true }
];
// 2. Conversão da estrutura em formato texto legível (JSON indentado)
const dadosParaGravar = JSON.stringify(maquinasIndustriais, null, 2);
// 3. Gravação física no disco rígido
const nomeDoArquivo = "maquinas.json";
fs.writeFileSync(nomeDoArquivo, dadosParaGravar);
console.log(`\nGravação concluída com sucesso.`);
console.log(`Verifique o arquivo '${nomeDoArquivo}' gerado na barra lateral do VS Code.`);