-- projeto smartcoffee
create database smartcoffee_gabriel;

use smartcoffee_gabriel;

create table delivery (
id_delivery int auto_increment primary key,
entregador varchar (60) not null,
data_saida datetime not null,
frete float not null,
data_entrega  datetime not null,
endereco varchar (100) not null,
preco float not null
);

create table pagamentos (
id_pagamentos int auto_increment primary key,
preco varchar (60) not null,
horario varchar (60) not null,
pedido varchar (60) not null,
forma_de_pagamento enum ('pix','cheque','dinheiro','cartao','valealimentacao','debito','credito') default 'debito'
);

create table funcionarios (
id_funcionarios int auto_increment primary key,
email varchar (60) not null,
escolaridade varchar (60) not null,
turno varchar (60) not null,
endereco varchar (100) not null,
data_nascimento datetime not null,
sexo varchar (20),
cargo varchar (60) not null,
cpf varchar (14) not null,
telefone varchar (60) not null,
salario float not null
);

create table clientes (
id_clientes int auto_increment primary key,
endereco varchar (100) not null,
cpf varchar (14) not null,
telefone varchar (60) not null,
nome varchar (60) not null,
email varchar (60) not null,
data_nascimento datetime not null
);

create table programa_fidelidade (
id_programa_fidelidade int auto_increment primary key,
desconto float not null,
cliente varchar (60) not null,
data_cadastro datetime not null,
historico_transferencias varchar (60) not null,
pontos float not null
);

create table pedidos (
id_pedidos int auto_increment primary key,
nome_produto varchar (60) not null,
preco float not null,
quantidade int not null,
mesa int not null,
horario_pedido datetime not null
);

create table produtos (
id_produtos int auto_increment primary key,
descricao varchar (60) not null,
nome varchar (60) not null,
preco float not null,
categoria varchar (60) not null,
validade datetime not null
);

create table estoque (
id_produtos int auto_increment primary key,
quantidade int not null,
estoque_minimo float not null,
local_estoque varchar(60) not null,
validade datetime not null,
produt enum ('nome','categoria') default 'nome'
);











