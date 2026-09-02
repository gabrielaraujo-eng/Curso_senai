-- comandos para criar bd
create database hotel_Gabriel;

-- comando para deletar db
drop database hotel_gabriel;  

-- comando para apagar table
drop table clientes;

-- comando para criar tabela
create table clientes (
id_clientes int auto_increment primary key,
cpf varchar(14) not null unique,
nome varchar(60) not null,
telefone varchar (16) not null,
endereco varchar(100),
data_nascimento date not null
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