-- Gera��o de Modelo f�sico
-- Sql ANSI 2003 - brModelo.



CREATE TABLE entrega (
id_delivery int,
id_pedidos int,
id_pagamento int,
id_funcionario int,
id_entrega int auto_increment primary key PRIMARY KEY
)

CREATE TABLE Delivery+Pedidos+Pagamento (
Entregador varchar(60) not null,
data_hora_saida datetime not null,
taxa_entrega float not null,
data_entrega datetime not null,
endereco_entrega varchar(60) not null,
id_delivery int auto_increment primary key,
preco_delivery float not null,
status_entrega varchar (40),
id_pedidos int auto_increment primary key,
preco_pedido float not null,
quantidade_pedido int not null,
Mesa int not null,
nome_produto varchar(60) not null,
data_hora datetime not null,
status_pedido varchar (40) ,
tipo_pedido varchar (40),
valor_total float not null,
data_hora_pagamento datetime not null,
id_pagamento int auto_increment primary key,
preco varchar(60) not null,
pedido varchar(60) not null,
Pix varchar(60) not null,
Cheque varchar(60) not null,
dinheiro float not null,
debito varchar(60) not null,
credito varchar(60) not null,
vale_alimentacao varchar(60) not null,
valor_pago float not null,
status_pagamento varchar (40),
PRIMARY KEY(id_delivery,id_pedidos,id_pagamento)
)

CREATE TABLE Funcionario (
Telefone int not null,
email_funcionario varchar(60) not null,
escolaridade varchar(60) not null,
id_funcionario int auto_increment primary key PRIMARY KEY,
Turno varchar(60) not null,
endereco_funcionario varchar(60) not null,
sexo varchar(60) not null,
cpf_funcionario varchar(60) not null,
cargo varchar(60) not null,
salario float not null,
Data_nascimento datetime not null,
nome_funcionario varchar (40)  not null,
data_admissao date time
)

CREATE TABLE atende (
id_funcionario int,
id_delivery int,
id_pedidos int,
id_atende int auto_increment primary key PRIMARY KEY,
FOREIGN KEY(id_funcionario) REFERENCES Funcionario (id_funcionario),
FOREIGN KEY(id_pedidos) REFERENCES Pedidos (id_pedidos)
FOREIGN KEY(Pagamento) REFERENCES Pedidos (Pagamento)
FOREIGN KEY(id_delivery) REFERENCES Delivery (id_delivery)
)

CREATE TABLE Clientes+Programa_fidelidade (
cpf_clientes varchar(60) not null,
Telefone int not null,
endereco_cliente varchar(60) not null,
id_clientes int auto_increment primary key,
nome_clientes varchar(60) not null,
Email_cliente varchar(60) not null,
data_nascimento datetime not null,
data_cadastro_cliente date time,
Cliente varchar(60) not null,
historico_transferencias varchar(60) not null,
saldo_pontos float not null,
id_fidelidade int auto_increment primary key,
-- Erro: nome do campo duplicado nesta tabela!
data_cadastro datetime not null,
desconto float not null,
data_ultima_atualizacao date time,
PRIMARY KEY(id_clientes,id_fidelidade)
)

CREATE TABLE Produtos (
id_produtos int auto_increment primary key PRIMARY KEY,
nome_produto varchar(60) not null,
preco_unitario float not null,
categoria varchar(60) not null,
Validade datetime not null,
descricao_produto varchar(60) not null
)

CREATE TABLE Rela��o_2+item_pedido (
id_produtos int,
id_delivery int,
id_pedidos int,
id_pagamento int,
quantidade float not null,
preco_historico float not null,
id_item_pedido int auto_increment primary_key PRIMARY KEY,
FOREIGN KEY(id_produtos) REFERENCES Produtos (id_produtos),
FOREIGN KEY(id_pedidos) REFERENCES Pedidos (id_pedidos),
FOREIGN KEY(id_pagamento) REFERENCES Pagamento (id_pagamento),
FOREIGN KEY(id_delivery) REFERENCES Delivery (id_delivery)
)

CREATE TABLE Rela��o_3+ficha_tecnica (
id_produtos int,
id_insumo int,
quantidade_gasta varchar (40),
id_ficha_tecnica int auto_increment primary key PRIMARY KEY,
FOREIGN KEY(id_produtos) REFERENCES Produtos (id_produtos)
)

CREATE TABLE Estoque (
id_insumo int auto_increment primary key PRIMARY KEY,
Nome_produto_estoque varchar(20),
Categoria varchar(20),
quantidade_atual int not null,
quantidade_minima int not null,
Validade datetime not null,
Local_estoque varchar(60) not null,
nome_insumo varchar (40),
unidade_medida Texto(1)
)

CREATE TABLE Realiza (
id_clientes int,
id_delivery int,
id_pagamento int,
id_pedidos int,
id_realiza int auto_increment primary key PRIMARY KEY,
FOREIGN KEY(id_clientes) REFERENCES Clientes (id_clientes)
FOREIGN KEY(id_fidelidade) REFERENCES Programa_fidelidade (id_fidelidade)
FOREIGN KEY(id_delivery) REFERENCES Delivery (id_delivery)
FOREIGN KEY(id_pedidos) REFERENCES Pedidos (id_pedidos)
FOREIGN KEY(id_pagamento) REFERENCES Pagamento (id_pagamento)
)
