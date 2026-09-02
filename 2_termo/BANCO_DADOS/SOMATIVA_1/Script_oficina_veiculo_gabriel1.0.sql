create database oficina_de_veiculo_gabriel;
use oficina_de_veiculo_gabriel;
create table clientes (
    id_cliente int primary key not null auto_increment,
    nome varchar(100) not null,
    cpf varchar(14) not null,
    email varchar(150) not null,
    endereco varchar(200) not null,
    telefone varchar(15) not null
);

create table pecas (
    id_peca int primary key auto_increment,
    fabricante varchar(100) not null,
    nome varchar(100) not null,
    quantidade int not null default 0,
    descricao varchar(255),
    preco decimal(10,2) not null default 0.00
);

create table pagamentos (
    id_pagamento int primary key not null auto_increment,
    pedido varchar(50) not null,
    data_pagamento datetime not null,
    status varchar(30) not null default 'pendente',
    preco decimal(10,2) not null,
    forma_pagamento varchar(50) not null
);

create table fornecedores (
    id_fornecedor int primary key not null auto_increment,
    endereco varchar(200) not null,
    email varchar(150) not null,
    nome varchar(100) not null,
    telefone varchar(15) not null,
    cnpj varchar(18) not null
);

create table funcionarios (
    id_funcionario int primary key not null auto_increment,
    nome varchar(100) not null,
    cpf varchar(14) not null,
    telefone varchar(15) not null,
    salario decimal(10,2) not null default 0.00,
    cargo varchar(50) not null
);

create table veiculos (
    id_veiculo int primary key auto_increment,
    modelo varchar(50) not null,
    ano year not null,
    cor varchar(30) not null,
    marca varchar(50) not null,
    placa varchar(8) not null
);

create table marcas (
    id_marca int primary key not null auto_increment,
    status varchar(30) not null default 'ativa',
    site varchar(60),
    nome_marca varchar(60) not null,
    pais_origem varchar(60) not null,
    data_fundacao date
);

create table modelos (
    id_modelo int primary key not null auto_increment,
    descricao varchar(255),
    nome_modelo varchar(60) not null,
    motorizacao varchar(60) not null,
    ano_modelo int not null,
    tipo_veiculo varchar(60) not null
);

create table servicos (
    id_servico int primary key not null auto_increment,
    descricao varchar(255),
    preco decimal(10,2) not null default 0.00,
    status varchar(20) not null default 'ativo',
    tempo_estimado int not null default 60,
    nome varchar(100) not null
);

create table ordens_de_servico (
    id_ordem_servico int primary key not null auto_increment,
    observacao varchar(255),
    status varchar(30) not null default 'aberta',
    data_abertura date not null default (current_date),
    data_fechamento date,
    valor_total decimal(10,2) not null default 0.00
);

alter table clientes add data_nascimento datetime not null;
alter table pecas add tamanho decimal(10,2) not null;
alter table pagamentos add  local_pagamento varchar(50) not null;
alter table fornecedores add local_fornecimento varchar(50) not null;
alter table funcionarios add comisao int not null default 0.00;
alter table veiculos add tamanho decimal(10,2) not null;
alter table marcas add criador varchar(50) not null;
alter table modelos add criador varchar(50) not null;
alter table servicos add taxa_servico decimal (10,2) not null default 0.00;
alter table ordens_de_servico add manutencao varchar(50);


alter table clientes drop column data_nascimento;
alter table pecas drop column tamanho;
alter table pagamentos drop column local_pagamento;
alter table fornecedores drop column local_fornecimento;
alter table funcionarios drop column comisao;
alter table veiculos drop column tamanho;
alter table marcas drop column criador;
alter table modelos drop column criador;
alter table servicos drop column taxa_servico;
alter table ordens_de_servico drop column manutencao;


rename table modelos to modelos_fab;
rename table modelos_fab to modelos;