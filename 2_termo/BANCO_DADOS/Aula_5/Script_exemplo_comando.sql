-- COMENTARIOS	
-- COMANDO PARA CRIAR BANCO DE DADOS
CREATE DATABASE Hotel;

-- APAGAR BANCO DE DADOS
-- DROP DATABASE hotel;

-- APAGAR TABELAS
DROP table clients;
-- ATIVAR BANCO DE DADOS
USE Hotel;

-- CRIAR TABELAS
CREATE TABLE clientes (
ID_CLIENTES	 INT auto_increment primary key, 
NOME varchar(60) not null,
CPF varchar(14) not null unique,
ENDERECO varchar(60) not null,
EMAIL varchar(100) not null,
TELEFONE varchar(15) not null
);
