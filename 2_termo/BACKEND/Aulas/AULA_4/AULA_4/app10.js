const entrada = require('readline-sync');
const num = entrada.questionInt("Tabuada de qual numero: ");

for (let i = 0; i <= 10; i++) {
    console.log(`${num} x ${i} = ${num * i}`);
}

// for usado para repetir uma ação, nesse caso a tabuada do numero escolhido, o for tem 3 partes, a primeira é a variavel de controle, no caso let i = 0, a segunda é a condição de parada, no caso i <= 10, e a terceira é o incremento da variavel de controle, no caso i++, que significa i = i + 1.

