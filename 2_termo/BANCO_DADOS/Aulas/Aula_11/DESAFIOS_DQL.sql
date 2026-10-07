-- Active: 1788351681239@@127.0.0.1@3306@smartcoffee_dml_gabriel
-- ============================================================
-- AULA 09 - ATIVIDADE PRÁTICA DE DQL
-- Nome: _______________________________________________
-- Turma: ______________________ Data: _________________
-- Base: smartcoffee_dql
-- ============================================================
USE smartcoffee_dml_gabriel;

-- PARTE A - AQUECIMENTO

-- 1. Liste todos os clientes cadastrados.
SELECT * FROM cliente;

-- 2. Exiba apenas nome, cidade e e-mail dos clientes.
SELECT nome,cidade ,email from cliente;

-- 3. Liste os nomes das cidades sem repetir valores.
SELECT DISTINCT cidade
FROM cliente;

-- 4. Liste todos os produtos em ordem crescente de preço.
SELECT  nome, preco
FROM produto
ORDER BY preco ASC;

-- 5. Mostre apenas os 5 produtos mais caros.
SELECT  nome, preco
FROM produto
ORDER BY preco DESC
LIMIT 5 OFFSET 5;

-- PARTE B - FILTROS

-- 6. Liste os produtos com preço entre R$ 8,00 e R$ 15,00.
SELECT nome, preco
FROM produto
WHERE preco >= 8.00 AND preco <= 15.00
ORDER BY preco ASC;


-- 7. Liste os clientes das cidades Limeira ou Americana.
SELECT nome, cidade, ativo AS Status
FROM cliente
WHERE ativo = TRUE or FALSE
AND (cidade = 'Limeira' OR cidade = 'Americana'); 

-- 8. Localize os produtos cujo nome contém a palavra “Café”.
SELECT nome
FROM produto
WHERE nome LIKE '%Café%';

-- 9. Liste os clientes que não informaram telefone.
SELECT nome, telefone
FROM cliente
WHERE telefone IS NULL;


-- 10. Mostre os pedidos FINALIZADOS com valor acima de R$ 20,00,
--     do maior para o menor valor.
SELECT status, valor_total
FROM pedido
WHERE status = 'FINALIZADO' AND valor_total >= 20.00
ORDER BY valor_total DESC;


-- PARTE C - CÁLCULOS E AGRUPAMENTOS

-- 11. Informe quantos produtos estão cadastrados.
SELECT id_categoria, COUNT(*) AS QTDE_PRODUTOS
FROM produto
GROUP BY id_categoria;

-- SELECT nome, SUM(preco) AS QTDE
-- FROM produto
-- GROUP BY nome;
-- SELECT id_categoria, SUM(preco) AS QTDE_PRODUTOS
-- FROM produto
-- GROUP BY id_categoria;
-- select * from produto;

-- 12. Mostre menor preço, maior preço e preço médio dos produtos.
SELECT MIN(preco) AS MENOR, MAX(preco) AS MAIOR, AVG(preco) AS MEDIA_PREÇOS
FROM produto;

-- 13. Informe quantos clientes existem em cada cidade.
SELECT cidade, COUNT(*) AS QTDE_CIDADES
FROM cliente
GROUP BY cidade;

-- 14. Mostre somente as cidades que possuem dois ou mais clientes.
SELECT cidade, COUNT(*) AS QUANTIDADES_CLIENTES
FROM cliente
GROUP BY cidade
HAVING COUNT(*) >= 2;

-- 15. Calcule o faturamento total considerando apenas pedidos FINALIZADOS.
SELECT SUM(valor_total) AS FATURAMENTO_MENSAL
FROM pedido
WHERE status = 'FINALIZADOS';