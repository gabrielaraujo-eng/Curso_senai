-- comandos para criar bd
create database hotel_Gabriel;
-- if (se) not exists (nao existe) vai criar, serve para verificar se existe e se ja existe vai continuar o script ao em vez de dar erro e parar.
create database if not exists hotel_Gabriel;

-- comando para deletar db
drop database hotel_gabriel;  

-- comando para apagar table
drop table clientes;
drop table produto;
drop table funcionarios;

-- comando para criar tabela
create table clientes (
id_clientes int auto_increment primary key,
cpf varchar(14) not null unique,
nome varchar(60) not null,
telefone varchar (16) not null,
endereco varchar(100),
data_nascimento timestamp not null default current_timestamp
);

-- cria tabela
Create table if not exists produto (
id_produto int auto_increment primary key,
reserva varchar(90) not null,
alimentos enum ('comida','bebida') default 'comida',
preco decimal (5,2) not null,
nome varchar(40) not null,
categoria varchar(60) not null
);



-- comando para ativar banco de dados
use hotel_gabriel;

-- comandos para alterar e corrigir
-- adicionando um campo (atributo) novo
alter table clientes add  email varchar(100);

-- modificar tipo de dados ou campos
alter table cliente modify email varchar(50);

-- renomear tabelas
rename table clientes to cliente;

-- excluir atributo 
alter table cliente drop column email;

-- visualizar tabelas no db
show tables;

-- limpar dados da tabela
truncate table cliente;

-- Parte 2 --

insert into clientes (id_clientes, cpf, nome, telefone, endereco, data_nascimento) 
values ('','123.213.321-32','(19)99999-9999','gabriel','rua senai', '');

insert into produto (id_produto, reserva, alimentos, preco, nome, categoria) 
values ('', 'reservado quarto X', 'comida', '50.00', 'gabriel', 'salgado');

create table funcionario (
id_funcionario int primary key,
email varchar(255) unique
);

-- comando para inserir dados na tabela
insert into funcionario (id_funcionario, email)
values (2, 'gabriell@senai.com.br');

-- comando para consultar informações na tabela
select * from funcionario;