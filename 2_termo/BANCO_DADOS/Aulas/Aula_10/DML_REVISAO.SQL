-- Active: 1788351681239@@127.0.0.1@3306@smartcoffee_dml_gabriel
USE SMARTCOFFEE_DML_GABRIEL;

--- INSERINDO DADOS NO BD
-- DML: INSERTS , UPDATE, DELETE

INSERT INTO cliente (nome, email, telefone, cidade, ativo) VALUES
('Adryan Costa', 'adryan@email.com', '199999901', 'Limeira',TRUE),
('Ana Francisca','ana2@email.com','1999999902','Lençois Paulista',TRUE),
('Anna Julia','anaj@email.com','19999999903','Limeira',TRUE),
('Beatriz Barros','beatrizb@email.com','19999999904','Limeira',TRUE),
('Beatriz Santana','beatrizs@email.com','19999999905','Limeira',TRUE),
('Bruno Dias','bruno2@email.com','19999999906','Limeira',TRUE),
('Cristopher da Costa','cristopher@email.com','19999999907','Mogi Guaçu',TRUE),
('Davi Guerra','davi@email.com',NULL,'Limeira',TRUE),
('Gabriel Lucio','gabriel2@email.com','19999999908','Limeira',TRUE),
('Gabriela lima','gabriela@email.com','19999999909','Limeira',TRUE),
('Giovana Santana','giovana@email.com',NULL,'Limeira',FALSE),
('Gustavo Couto','gustavo@email.com','19999999910','Ipatinga',FALSE),
('Isabeli Sousa','isabeli2@email.com',NULL,'Limeira',TRUE),
('Jacó de Souza Rufino','jaco@email.com','19999999911','Limeira',TRUE),
('Joao Moreira','joao2@email.com','19999999912','Limeira',TRUE),
('John Pierre','jonh@email.com','19999999913','cap haitien',TRUE),
('Jonas Dawid','jonas@email.com','19999999914','rio de janeiro',TRUE),
('Juan Pablo','juan@email.com','19999999915','Limeira',TRUE),
('Julia Fernanda','julia@email.com','19999999916','Limeira',TRUE);

--INSERINDO CAMPOS COM CHAVE ESTRANGEIRA
INSERT INTO produto (nome, preco, ativo, id_categoria) VALUES
('Manteiga Giovana',14.00,TRUE,4)

INSERT INTO pedido (data_pedido, status, valor_total, id_cliente) VALUES
(NOW(),'ABERTO', 14.00, 24)


SET @pedido = LAST_INSERT_ID();
SELECT @pedido

--------------------------------------------------------------------------

--ATUALIZANDO OU MODIFICANDO DADOS NO BD
-- EX:1 ATUALIZANDO INFORMAÇÕES INDIVIDUAIS
UPDATE cliente
SET telefone = '199999888801'
WHERE id_cliente = 21;

UPDATE cliente
SET ativo = TRUE
WHERE id_cliente = 8;

---NUNCA, JAMIS, NEVER ESQUEÇAM DE UTILIZAR O WHERE

-- REGRA DE OURO 
-- PRIMEIRA ETAPA 
SELECT * FROM cliente
WHERE id_cliente = 18;

-- SEGUNDA ETAPA
UPDATE cliente
SET ativo = TRUE
WHERE id_cliente = 8;

-- EX: 2 ATUALIZANDO MAIS DO QUE UM CAMPO
UPDATE cliente
SET telefone = '1999888016',
    cidade = 'Campinas'
WHERE id_cliente = 8;

-- EX: 3 ATUALIZANDO COM CONDICIONAIS
UPDATE produto
SET preco = preco * 2.50
WHERE id_categoria = 1


--APAGAR DADOS
-- EX: 1 APAGAR DADOS SEM CONTER INFORMAÇÕES
DELETE FROM cliente;

-- EX: 2 APAGAR DADOS COM CONDIÇÕES
DELETE FROM cliente
WHERE id_cliente = 18;

-- EX: 3 APAGANDO DADOS DE TODA TABELA
TRUNCATE TABLE cliente;

-- EX: 4 APAGAR DE FORMA REPRESENTATIVA OU LÓGICA
UPDATE produto
SET ativo = FALSE
WHERE id_produto = 19

-------------------------------------------------------------------
-- REALIZANDO PASSOS PARA UMA COMPRA NO SMARTCOFFEE
-- PASSO 1: CADASTRAR UM NOVO CLIENTE
INSERT INTO cliente (nome,email,telefone,cidade,ativo) VALUES
('Gabriel A','gabriel0@email.com','19999123456','Limeira',TRUE);
SET @cliente = LAST_INSERT_ID();

-- PASSO 2: CRIAR O PEDIDO
INSERT INTO pedido (data_pedido,status,valor_total,id_cliente) VALUES
(NOW(),'ABERTO',0.00,158);
SET @pedido = LAST_INSERT_ID();

-- PASSO 3: INSERIR ITENS NO PEDIDO
INSERT INTO item_pedido (id_pedido,id_produto,quantidade,preco_unitario) VALUES
(@pedido,4,1,10.50),
(@pedido,11,1,9.98);

--PASSO 4: ATUALIZAR O TOTAL E STATUS
UPDATE pedido
SET valor_total = 84.38,
    status = 'Preparando'
WHERE id_pedido = @pedido;

-- PASSO 5: REGISTRAR PAGAMENTO
INSERT INTO pagamento (id_pedido,id_forma_pagamento,valor,data_pagamento) VALUES
(@pedido,1,84.38,NOW());

delete from pagamento
where id_pagamento = 1;



--CONSULTAR DADOS EM TABELAS BD
--CONSULTA DA TABELA
select * from pagamento;
--CONSULTAR INDIVIDUAL POR ID
select * from cliente
WHERE id_cliente = 15;



