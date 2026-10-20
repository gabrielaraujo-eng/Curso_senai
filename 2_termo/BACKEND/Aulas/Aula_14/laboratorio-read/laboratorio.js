// const fs = require("fs");
// const texto = fs.readFileSync("maquinas.json", "utf8");
// console.log(typeof texto);
// console.log(texto);

// node:fs:441
//     return binding.readFileUtf8(path, stringToFlags(options.flag));
//                    ^

// Error: ENOENT: no such file or directory, open 'C:\Users\54995847880.SESISENAI.000\OneDrive - SESISENAISP - Escolas\Curso_senai\2_termo\BACKEND\Aulas\Aula_14\laboratorio-read\arquivo-inexistente.json'
//     at Object.readFileSync (node:fs:441:20)
//     at Object.<anonymous> (C:\Users\54995847880.SESISENAI.000\OneDrive - SESISENAISP - Escolas\Curso_senai\2_termo\BACKEND\Aulas\Aula_14\laboratorio-read\laboratorio.js:2:18)
//     at Module._compile (node:internal/modules/cjs/loader:1871:14)
//     at Object..js (node:internal/modules/cjs/loader:2002:10)
//     at Module.load (node:internal/modules/cjs/loader:1594:32)
//     at Module._load (node:internal/modules/cjs/loader:1396:12)
//     at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
//     at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
//     at node:internal/main/run_main_module:33:47 {
//   errno: -4058,
//   code: 'ENOENT',
//   syscall: 'open',
//   path: 'C:\\Users\\54995847880.SESISENAI.000\\OneDrive - SESISENAISP - Escolas\\Curso_senai\\2_termo\\BACKEND\\Aulas\\Aula_14\\laboratorio-read\\arquivo-inexistente.json'
// }

const fs = require("fs");
const texto = fs.readFileSync("maquinas.json", "utf8");
const maquinas = JSON.parse(texto);
maquinas.forEach((maquina, indice) => {
  console.log(`${indice + 1}. ${maquina.nome} - ${maquina.setor} - ${maquina.status}`);
});