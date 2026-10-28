-- Active: 1788351681239@@127.0.0.1@3306@biblioteca_som2gabriel
create DATABASE if not exists biblioteca_som2gabriel;
use biblioteca_som2gabriel;
drop DATABASE biblioteca_som2gabriel;
CREATE TABLE usuario (
id_usuario INT auto_increment primary key, 
nome varchar(100) not null,
email varchar(120) not null unique,
telefone varchar(20), 
ativo BOOLEAN DEFAULT true
);

CREATE table livro (
    id_livro int AUTO_INCREMENT primary key,
    titulo VARCHAR(150) not null,
    autor VARCHAR(120) NOT NULL,
    isbn CHAR(13) NOT NULL UNIQUE,
    ano_publicacao INt,
    quantidade_disponivel INT DEFAULT 0,
    editora VARCHAR(100),

    CONSTRAINT quantidade_disponivel CHECK (quantidade_disponivel >= 0)
); -- alter table livro add  editora varchar(100);

create table emprestimo (
    id_emprestimo INT Primary key AUTO_INCREMENT,
    id_usuario int ,
    id_livro int,
    data_emprestimo DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_prevista DATE NOT NULL,
    data_devolucao DATE,
    status_emprestimo VARCHAR(20) DEFAULT 'ABERTO', 
    -- CHECK
    CONSTRAINT ck_status_emprestimo CHECK (status_emprestimo = 'ABERTO'),
    CONSTRAINT id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT id_livro FOREIGN KEY (id_livro) REFERENCES livro (id_livro)
    -- id_usuario INT FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    -- id_livro INT FOREIGN KEY (id_livro) REFERENCES livro (id_livro)
    -- id_usuario INT FK → USUARIO
    -- id_livro INT FK → LIVRO
);


create table entrega (
    id_entrega int primary key AUTO_INCREMENT,
    id_pagamento int,
    nome_entrega varchar(100) not null,
    endereco_entrega VARCHAR(120) not null,
    status_entrega BOOLEAN DEFAULT true,

    CONSTRAINT id_pagamento FOREIGN KEY (id_pagamento) REFERENCES pagamento (id_pagamento)
)

create table pagamento (
    id_pagamento int AUTO_INCREMENT primary KEY,
    nome_pagamento VARCHAR(80) not null,
    status_pagamento BOOLEAN DEFAULT true,
    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- FOREIGN KEY(id_produtos) REFERENCES Produtos (id_produtos),
-- CONSTRAINT FK_PEDIDO_CLIENTE FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTES (ID_CLIENTE)

insert into usuario ( nome, email, telefone, ativo) VALUES
("gabriel 1", "gabriel1@gmail.com", "19987434320", true),
("gabriel 2", "gabriel2@gmail.com", "19999999991", true),
("gabriel 3", "gabriel3@gmail.com", null, true),
("gabriel 4", "gabriel4@gmail.com", "19999999991", true);

insert into livro (titulo, autor, isbn, ano_publicacao, quantidade_disponivel, editora ) VALUES
("Alquimista", "minato", 978-8575427583, 1988, 12, "rocco"),
("the world", "naruto", 978-8575427584, 1989, 13, "rocco2"),
("finlandia", "boruto", 978-8575427585, 1938, 14, "rocco3"),
("boto", "valrudo", 978-8575427586, 1928, 15, "rocco4"),
("viva", "charuto", 978-8575427587, 1918, 16, "rocco5"),
("ddd", "sasuke", 978-8575427588, 1968, 17, "rocco6");

insert into emprestimo (id_usuario, id_livro, data_prevista, data_devolucao, status_emprestimo) VALUES
(1, 2, NOW(), NOW(), 'ABERTO' ),
(2, 3, NOW()+1, NOW()+1, 'ABERTO' ),
(3, 4, NOW(), NOW(), 'ABERTO' );

select id_usuario, telefone from usuario;
UPDATE usuario
SET telefone = '0987654321'
WHERE id_usuario = 1;

insert into livro (titulo, autor, isbn, ano_publicacao, quantidade_disponivel, editora ) VALUES
("ddd12", "sasuke23", 978-8575427599, 2024, 17, "rocco8");

update livro
set quantidade_disponivel = quantidade_disponivel + 2
where ano_publicacao >= 2020;

select * from emprestimo;

insert into usuario ( nome, email, telefone, ativo) VALUES
("gabriel 5", "gabriel9@gmail.com", "1998743496", true);

select id_usuario, nome from usuario;

delete from usuario 
where id_usuario = 5;








   


