const produto = {
    nome: "Teclado Mecânico",
    preco: 150.00,
    estoque: 25,
    emOferta: true
};

console.log(`Produto: ${produto.nome}`);
console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);
console.log(`Produto: ${produto.nome} | ${produto.preco} | ${produto.estoque} | ${produto.emOferta}`);