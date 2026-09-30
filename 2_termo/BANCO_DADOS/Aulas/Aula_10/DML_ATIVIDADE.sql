-- ============================================================
-- AULA 08 - ATIVIDADE PRÁTICA DE DML
-- Nome: _______________________________________________
-- Turma: ______________________ Data: _________________
-- Base: smartcoffee_dml
-- ============================================================
USE smartcoffee_dml_gabriel;

-- IMPORTANTE:
-- Para toda questão de UPDATE ou DELETE, escreva primeiro um SELECT
-- com o mesmo WHERE para validar os registros afetados.

-- PARTE A - INSERT

-- 1. Cadastre dois novos clientes com dados diferentes.
INSERT INTO cliente (nome,email,telefone,cidade, ativo) VALUES
('Gabriel B','gb@email.com','19999900282','Limeira',TRUE),
('Gabriel C','gc@email.com','19999900282','Limeira',TRUE);

-- 2. Cadastre a categoria 'Especiais da Casa'.
INSERT INTO categoria (nome) VALUES
('Especiais da Casa');

-- 3. Localize o id da categoria criada e cadastre três produtos nela.

SELECT * FROM categoria
WHERE id_categoria = 16;

INSERT INTO produto(nome,preco,ativo,id_categoria) VALUES
('1',2.0,FALSE,16),
('2',2.0,FALSE,16),
('3',2.0,FALSE,16);

-- 4. Cadastre um terceiro cliente sem telefone.
INSERT INTO cliente (nome,email,telefone,cidade, ativo) VALUES
('Gabriel D','gd@email.com',NULL,'Limeira',TRUE);

-- 5. Crie um novo pedido para um dos clientes cadastrados.
INSERT INTO pedido (data_pedido,status,valor_total,id_cliente) VALUES
(NOW(),'ABERTO',20.00,163);

-- 6. Use LAST_INSERT_ID() para guardar o id do pedido em @pedido_atividade
-- e insira pelo menos dois itens nesse pedido.
SET @pedido_atividade = LAST_INSERT_ID();
SELECT @pedido_atividade;
INSERT INTO item_pedido (id_pedido,id_produto,quantidade,preco_unitario,observacao) VALUES
(35,4,5,10.00,NULL),
(35,8,5,10.00,NULL);

-- PARTE B - UPDATE

-- 7. Corrija o telefone de um dos clientes criados.
-- SELECT de validação:
-- UPDATE:
-- SELECT final:

SELECT * from cliente;
UPDATE cliente
SET telefone = '1999902123'
WHERE id_cliente = 160;
SELECT * from cliente;


-- 8. Altere cidade e telefone de outro cliente em um único UPDATE.

UPDATE cliente
SET telefone = '1999902123',
    cidade = 'Pindamonhangaba'
WHERE id_cliente = 1;
SELECT * from cliente;

-- 9. Aumente em 8% o preço dos produtos da categoria 'Especiais da Casa'.

UPDATE produto
SET preco = preco * 1.08
WHERE id_categoria = 16;

SELECT * from categoria;


-- 10. Altere o status do pedido criado para 'PREPARANDO'.


-- 11. Atualize valor_total do pedido de acordo com os itens cadastrados.
--     Você pode calcular previamente com SELECT SUM(quantidade * preco_unitario).
PULARRRRRRR

-- 12. Escolha um dos produtos criados e faça uma exclusão lógica (ativo = FALSE).


-- PARTE C - DELETE

-- 13. Crie um cliente de teste sem pedidos.
--     Depois localize e exclua apenas esse cliente.


-- 14. Tente excluir um cliente da base original que possua pedidos.
--     Deixe o DELETE comentado após o teste e descreva o erro abaixo.
-- Resultado observado:


-- 15. Explique em comentário por que a FK bloqueou a exclusão.
-- Resposta:


-- 16. Crie uma categoria temporária chamada 'Excluir Depois' e remova-a.