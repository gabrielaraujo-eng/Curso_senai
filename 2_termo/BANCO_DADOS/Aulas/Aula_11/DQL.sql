-- Active: 1788351681239@@127.0.0.1@3306@smartcoffee_dml_gabriel
INSERT INTO cliente (nome,email,telefone,cidade,ativo) VALUES
('Edson Wladimir', 'edson@email.com', '199999888244', 'Paris', TRUE);

-- Exemplo de estrutura simples de SELECT
-- SELECT coluna
-- FROM tabela;

-- EX 1: SELECT PARA CONSULTAR TODAS AS COLUNAS
SELECT * FROM cliente;

-- EX 2:  CONSULTANDO POR COLUNAS
SELECT nome, email from cliente;

-- EX 3: INSERINDO APELIDO NAS COLUNAS -- ALIAS
SELECT nome AS Cliente
FROM cliente;
SELECT nome AS Cliente, telefone AS Contato, ativo AS Status
FROM cliente;
SELECT nome, preco, preco * 0.9 AS Preco_Promocional
FROM produto;

-- EX 4: DISTINCT - ELIMINAR REPETIÇÕES
SELECT cidade FROM cliente;

SELECT DISTINCT cidade
FROM cliente;
-- SEM DISTINCT O ITEM IRÀ APARECER VARIAS VEZES
-- COM DISTINCT O ITEM IRÁ APARECER APENAS UMA VEZ

-- EX 5: FILTRO EM REGISTROS 
SELECT nome, preco
FROM produto
WHERE preco > 10;
-- RETORNA VALORES ACIMA DE 10 REAIS EM SEUS PREÇOS

SELECT nome, preco
FROM cliente
WHERE ativo = TRUE;
-- RETORNA PRODUTOS ATIVOS

SELECT id_pedido, data_pedido, valor_total
FROM pedido 
WHERE valores_total >= 25.00;
-- RETORNA PEDIDOS ACIMA DE DETERMINADO VALOR

-- OPERADORES DE COMPARAÇÃO
-- = IGUAL
-- <> OU != DIFERENTE
-- > MAIOR 
-- >= MAIOR OU IGUAL
-- < MENOR
-- <= MENOR OU IGUAL

-- EX 6: USO DE AND, OR E NOT
-- AND - TODAS AS CONDIÇÕES PRECISAM SER VERDADEIRAS
SELECT nome, preco
FROM produto
WHERE preco >= 8.00 AND preco <= 20.00

-- OR - PELO MENOS UMA CONDIÇÃO VERDADEIRA
SELECT nome, cidade
FROM cidade
WHERE cadade = 'Limeira' OR cidade = 'Piracicaba';

-- NOT - NEGAR NÃO TRAZER O RESULTADO QUE FOI APRESENTADO
SELECT nome, cidade
FROM cliente
WHERE NOT cidade = 'Limeira';

-- JUNTOS - AND E OR
SELECT nome, cidade, ativo AS Status
FROM cliente
WHERE ativo = TRUE
AND (cidade = 'Limeira' OR cidade = 'Americana'); 

-- EX 7: PESQUISANDO POR INTERVALOS - BETWEEN
SELECT nome, preco                              
FROM produto
WHERE preco BETWEEN 8.00 AND 15.00;

SELECT id_pedido, data_pedido, valor_total
FROM pedido
WHERE data_pedido BETWEEN '2026-09-01 00:00:00' AND '2026-09-30 23:59:59';

-- EX 8: IN COM VARIAS POSSIBILIDAS
SELECT nome, cidade
FROM cliente
WHERE cidade IN ('Limeira', 'Americana', 'Piracicaba');

SELECT nome, cidade 
FROM cliente
WHERE cidade NOT IN ('Limeira', 'Campinas');

-- EX 9: EXEMPLO COM TEXTOS OU PESQUISAR POR TEXTOS - LIKE
-- CORINGAS
-- % VÁRIOS CARACTERES
-- _ EXATAMENTE UM CARACTER

SELECT nome
FROM produto
WHERE nome LIKE 'Café%';
-- RETORNAR PRODUTOS QUE POSSUEM A PALAVRA CAFÉ E QUE COMEÇAM COM ELA

SELECT nome
FROM produto
WHERE nome LIKE '%chocolate%';
-- RETORNAR PRODUTOS QUE POSSUEM A PALAVRA CHOCOLATE

SELECT nome
FROM produto
WHERE nome LIKE '%Silva';
-- RETORNAR NOMES QUE TERMINAM COM SILVA

SELECT nome
FROM produto
WHERE nome LIKE '_afé%';

-- EX 10: NULL - AUSÊNCIA DE VALOR
SELECT nome, telefone
FROM cliente
WHERE telefone IS NULL;

SELECT nome, telefone
FROM cliente
WHERE telefone IS NOT NULL;

-- EX 11: ORDER BT - ORDENAR RESULTADOS
-- ASC SIGNIFICA CRESCENTE
-- DESC SIGNIFICA DECRESCENTE
SELECT  nome, preco
FROM produto
ORDER BY preco ASC;

SELECT nome, preco
FROM produto 
ORDER BY preco DESC;

SELECT cidade, nome
FROM cliente
ORDER BY cidade ASC, nome DESC;

-- EX 12: LIMIT - LIMITANDO A QUANTIDADE DE LINHA
SELECT nome, preco
FROM produto
ORDER BY preco DESC
LIMIT 8;

SELECT nome, preco
FROM produto
ORDER BY nome
LIMIT 5 OFFSET 5;

-- EX 13: CÁUCULO DE COLUNAS E VALORES PROJETÁVEIS
SELECT nome, preco, preco * 2.00 AS preco_atualizado
FROM produto;

SELECT id_item, quantidade, preco_unitario, quantidade * preco_unitario AS total_Compra
FROM item_pedido;

-- EX 14: FUNÇÕES PARA CONSULTA 
-- TEXTOS
SELECT UPPER(nome) AS Nome_Cliente, LOWER(email) AS Email
FROM cliente;

SELECT CONCAT(nome, ' -- ', cidade) AS Cliente_Cidade
FROM cliente;

-- NUMEROS 
SELECT nome, preco, ROUND(preco * 0.90, 2) AS Preco_Desconto
FROM produto;

-- DATAS 
SELECT id_pedido, data_pedido, DATE(data_pedido) AS DATAS, DAY(data_pedido) AS DIA, MONTH (data_pedido) AS MÊS, YEAR(data_pedido) AS ANO 
FROM pedido;

-- SUBSTITUINDO O NULL NO RESULTADO
SELECT nome, COALESCE(telefone, 'Não informado') AS Contato
FROM CLIENTE;

-- EX 15: FUNÇÕES DE AGREGAÇÃO - SUM, AVG, MIN, MAX, COUNT
-- COUNT - CONTAR QUANTIDADE DE REGISTROS
-- SUM - SOMA DE VALORES
-- AVG - MÉDIA DE VALORES 
-- MIN - MENOR VALOR 
-- MAX - MAIOR VALOR    

SELECT COUNT(*) AS Total_Clientes
FROM cliente;
-- RESULTATO DE QUANTIDADE DE CLIENTES

SELECT AVG(preco) AS Media_Preços
FROM produto;
-- MEDIA DO VALOR DOS PRODUTOS

SELECT MIN(preco) AS PROMOÇÂO, MAX(preco) AS REAJUSTE, AVG(preco) AS MEDIA_PREÇOS
FROM produto;

SELECT SUM(valor_total) AS FATURAMENTO_MENSAL
FROM pedido
WHERE status = 'ABERTO';
-- TOTAL DE PEDIDOS FINALIZADOS
SELECT * FROM pedido;

-- EX 16: GROUP BY - AGRUPAR DADOS
SELECT cidade, COUNT(*) AS QTDE_CIDADES
FROM cliente
GROUP BY cidade;
-- CONSULTA POR GRUPOS DE CIDADES 

SELECT id_categoria, COUNT(*) AS QTDE_PRODUTOS
FROM produto
GROUP BY id_categoria;
-- QUANTIDADE DE PRODUTOS POR CATEGORIA

-- EX 17 : HAVING - FILTRO POR GRUPOS
SELECT cidade, COUNT(*) AS QUANTIDADES_CLIENTES
FROM cliente
GROUP BY cidade
HAVING COUNT(*) >= 2;
-- DICA USAR O HAVING E NÃO ESQUECER O GROUP BY

------------------------------------------------------------------------------
-- EX 18: CONSULTA COMPLETA 
SELECT colunas
FROM tabela
WHERE condicao
GROUP BY colunas_agrupar
HAVING condicao
ORDER BY colunas
LIMIT QUANTIDADE;
-- DICA PARA SEGUIR EM ORDEM LÓGICA PARA UMA CONSULTA PARCIAL OU COMPLETA
------------------------------------------------------------------------------




