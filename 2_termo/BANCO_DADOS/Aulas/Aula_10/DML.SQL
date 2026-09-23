-- Active: 1788351681239@@127.0.0.1@3306@smartcoffee_dml_gabriel
-- SMARTCOFFEE BASE DE DADOS - DML 
-- EXECUTE SEMPRE QUE QUISER RESTAURAR A AULA



DROP DATABASE IF EXISTS SMARTCOFFEE_DML_GABRIEL;
CREATE DATABASE SMARTCOFFEE_DML_GABRIEL;

USE SMARTCOFFEE_DML_GABRIEL;

CREATE TABLE cliente (
    id_cliente int PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) not null,
    email VARCHAR(120) UNIQUE,
    telefone VARCHAR(20),
    cidade VARCHAR(60) not null,
    ativo boolean not null default true
);

CREATE table categoria (
    id_categoria int PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) not null unique 
);

CREATE Table produto (
    id_produto int PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) not null,
    preco decimal(10,2) not null, 
    ativo BOOLEAN not NULL DEFAULT true,
    id_categoria int not null,
    -- constraint : significa uma restição e declaração de chave estranjeira
    constraint fk_produto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

create table pedido (
    id_pedido int PRIMARY key AUTO_INCREMENT,
    data_pedido datetime not null,
    status enum('ABERTO', 'PREPARADO', 'FINALIZADO', 'CANCELADO') NOT NULL,
    valor_total DECIMAL(10,2) not null default 0.00,
    id_cliente int not null,
    constraint fk_produto_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE table item_pedido (
    id_item int PRIMARY KEY AUTO_INCREMENT,
    id_pedido int not null,
    id_produto int not null,
    quantidade int not null,
    preco_unitario decimal(10,2) not null,
    observacao VARCHAR(150),
    constraint fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    constraint fk_item_produto FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE table forma_pagamento (
    id_forma_pagamento int PRIMARY KEY AUTO_INCREMENT,
    descricao varchar(40) not null UNIQUE
);

create table pagamento (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido int not null,
    id_forma_pagamento int not null,
    valor decimal(10,2),
    data_pagamento datetime,
    constraint fk_pagamento_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    constraint fk_pagamento_forma foreign key (id_forma_pagamento) REFERENCES forma_pagamento(id_forma_pagamento)
);

insert into cliente (nome, email, telefone, cidade, ativo) VALUES 
('Ana silva', 'ana@email.com', '19999990001', 'Limeira', TRUE),
('Bruno souza', 'bruno@email.com', '19999990002', 'Limeira', TRUE),
('Carla mendes', 'carla@email.com', null , 'Americana', TRUE),
('Diego Santos', 'diego@email.com', '19999990004', 'Campinas', TRUE),
('Elisa Rocha', 'elisa@email.com', null, 'Limeira', TRUE),
('Felipe Lima', 'felipe@email.com', '19999990006', 'Americana', TRUE),
('Gabriel alves', 'gabriel@email.com', '19999990007', 'Piracicaba', TRUE),
('Henrique costa', 'henrique@email.com', null , 'Limeira', FALSE),
('Isabeli Martins', 'isabeli@email.com', '19999990009', 'Campinas', TRUE),
('Joao Pereira', 'joao@email.com', '19999990010', 'Limeira', TRUE);

select * from cliente;

INSERT into categoria (nome) VALUES
('Cafés'), ('Bebidas Geladas'), ('Doces'), ('Salgados'), ('Combos');

SELECT * FROM categoria;

insert into produto (nome, preco, ativo, id_categoria) VALUES
('Café Espresso', 7.00, TRUE, 1), ('Café Duplo', 10.00, TRUE, 1),
('Café com leite', 9.50, TRUE, 1), ('Cappuccino', 13.00, TRUE, 1),
('Mocha chocolate', 15.50, TRUE, 1), ('Cold Brew', 14.00, TRUE, 2),
('Frappé de chocolate', 18.00, TRUE, 2), ('Suco de laranja', 11.00, TRUE, 2);

SELECT * From produto;

insert into pedido (data_pedido, status, valor_total, id_cliente) VALUES
('2026-09-01 08:15:00', 'FINALIZADO', 16.00, 1),
('2026-09-01 09:30:00', 'FINALIZADO', 26.00, 2),
('2026-09-02 12:30:00', 'CANCELADO', 26.00, 3),
('2026-09-02 14:30:00', 'FINALIZADO', 43.00, 2),
('2026-09-02 19:30:40', 'FINALIZADO', 06.00, 4),
('2026-09-03 07:30:00', 'FINALIZADO', 26.40, 5),
('2026-09-03 08:30:00', 'FINALIZADO', 26.00, 6),
('2026-09-03 09:30:00', 'FINALIZADO', 28.00, 7),
(NOW(), 'ABERTO', 0.00, 8);

SELECT * FROM pedido; 

set @pedido = LAST_INSERT_ID();
select @pedido;

insert into item_pedido (id_pedido, id_produto, quantidade, preco_unitario, observacao) VALUES
(1,1,1,7.00,Null),(1,9,1,79.00,Null),(2,4,2,13.00,'Sem canela'),
(3,7,1,18.00,Null),(4,5,1,15.50,Null),(4,16,1,20.00,Null);

select * from item_pedido;

insert into forma_pagamento (descricao) VALUES
('Dinheiro'), ('Pix'), ('Cartao de Crédito'), ('Cartao de Débito');

select * from forma_pagamento;

insert into pagamento (id_pedido, id_forma_pagamento, valor, data_pagamento) VALUES
(1,2,16.00, '2026-09-03 09:30:00'),(2,4,26.00,'2026-09-03 09:40:00'),
(4,3,35.50, '2026-09-03 09:50:00'),(5,2,20.00,'2026-09-03 10:30:00');

select * from pagamento;

