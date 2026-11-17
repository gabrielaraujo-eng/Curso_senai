-- Active: 1788351681239@@127.0.0.1@3306@biblioteca_som2gabriel
-- ==========================================================
-- FASE 1 ----------------------------------------------------------------------------------------------
-- 1:
create DATABASE if not exists biblioteca_som2gabriel;
use biblioteca_som2gabriel;
drop DATABASE biblioteca_som2gabriel;
--------------------------------------------------
-- 2:
CREATE TABLE usuario (
id_usuario INT auto_increment primary key, 
nome varchar(100) not null,
email varchar(120) not null unique,
telefone varchar(20), 
ativo BOOLEAN DEFAULT true
);
--------------------------------------------------
--3:

CREATE table livro (
    id_livro int AUTO_INCREMENT primary key,
    titulo VARCHAR(150) not null,
    autor VARCHAR(120) NOT NULL,
    isbn CHAR(13) NOT NULL UNIQUE,
    ano_publicacao INt,
    quantidade_disponivel INT DEFAULT 0,
    --5: --------------------------------------------------
    editora VARCHAR(100),

    CONSTRAINT quantidade_disponivel CHECK (quantidade_disponivel >= 0)
); -- alter table livro add  editora varchar(100);
--------------------------------------------------
--4:
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

--------------------------------------------------
--extra
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
----------------------------------------------------------------------------------------------------
-- FOREIGN KEY(id_produtos) REFERENCES Produtos (id_produtos),
-- CONSTRAINT FK_PEDIDO_CLIENTE FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTES (ID_CLIENTE)
---------------------------------------------------------------------------------------------------------------------------------------------
-- ==========================================================
-- FASE 2 ----------------------------------------------------------------------------------------------
--6:
insert into usuario ( nome, email, telefone, ativo) VALUES
("gabriel 1", "gabriel1@gmail.com", "19987434320", true),
("gabriel 2", "gabriel2@gmail.com", "19999999991", true),
("gabriel 3", "gabriel3@gmail.com", null, true),
("gabriel 4", "gabriel4@gmail.com", "19999999991", true);
----------------------------------------------------
--7:
insert into livro (titulo, autor, isbn, ano_publicacao, quantidade_disponivel, editora ) VALUES
("Alquimista", "minato", 978-8575427583, 1988, 12, "rocco"),
("the world", "naruto", 978-8575427584, 1989, 13, "rocco2"),
("finlandia", "boruto", 978-8575427585, 1938, 14, "rocco3"),
("boto", "valrudo", 978-8575427586, 1928, 15, "rocco4"),
("viva", "charuto", 978-8575427587, 1918, 16, "rocco5"),
("ddd", "sasuke", 978-8575427588, 1968, 17, "rocco6");
--------------------------------------------------
--8:
insert into emprestimo (id_usuario, id_livro, data_prevista, data_devolucao, status_emprestimo) VALUES
(1, 2, NOW(), NOW(), 'ABERTO' ),
(2, 3, NOW()+1, NOW()+1, 'ABERTO' ),
(3, 4, NOW(), NOW(), 'ABERTO' );
--------------------------------------------------
--9:
select id_usuario, telefone from usuario;
UPDATE usuario
SET telefone = '0987654321'
WHERE id_usuario = 1;
--------------------------------------------------
--10:
insert into livro (titulo, autor, isbn, ano_publicacao, quantidade_disponivel, editora ) VALUES
("ddd12", "sasuke23", 978-8575427599, 2024, 17, "rocco8");

update livro
set quantidade_disponivel = quantidade_disponivel + 2
where ano_publicacao >= 2020;

select * from emprestimo;
--------------------------------------------------
--11:
insert into usuario ( nome, email, telefone, ativo) VALUES
("gabriel 5", "gabriel9@gmail.com", "1998743496", true);

select id_usuario, nome from usuario;

delete from usuario 
where id_usuario = 3;

-- 11, resposta: Não tem como por causa da fk, FOREIGN KEY
---------------------------------------------------------------------------------------------------------------------------------------------
-- ==========================================================
--  FASE 3 ---------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------
--12:
select titulo, autor, quantidade_disponivel from livro;
--------------------------------------------------
--13:
select quantidade_disponivel 
from livro
where quantidade_disponivel >= 13 -- OBSERVAÇÃO coloquei maior que 13 por nao ter um menor que esse valor por tanto nao faria diferença caso nao tivesse 
ORDER BY quantidade_disponivel desc;
--------------------------------------------------
--14:
SELECT titulo
FROM livro
WHERE titulo LIKE 'viva';

-- select ano_publicacao 
-- from livro
-- where ano_publicacao >= 2015 and ano_publicacao <= 2025;
--------------------------------------------------
--15:
SELECT ano_publicacao                              
FROM livro
WHERE ano_publicacao BETWEEN 2015 AND 2025;

--------------------------------------------------
--16:
select 
COUNT(quantidade_disponivel) as total_livros, 
SUM(quantidade_disponivel) as soma_quantidade,
AVG(quantidade_disponivel) as media_quantidade, 
MIN(quantidade_disponivel) as menor_quantidade, 
MAX(quantidade_disponivel) as maior_quantidade
from livro; 

-- select id_emprestimo, id_usuario, id_livro, data_emprestimo, status_emprestimo from emprestimo;
--------------------------------------------------
--17:
SELECT E.id_emprestimo, U.id_usuario, U.NOME AS CLIENTE, E.data_emprestimo, E.status_emprestimo
FROM emprestimo AS E
INNER JOIN usuario AS U
ON E.id_emprestimo = U.id_usuario;

-- insert into emprestimo (id_usuario, id_livro, data_prevista, data_devolucao, status_emprestimo) VALUES
-- (3, 3, NOW()+1, NOW()+1, 'FECHADO' );
--------------------------------------------------
--18:
SELECT E.id_emprestimo, U.id_usuario, U.NOME AS CLIENTE, E.data_emprestimo, E.status_emprestimo
FROM emprestimo AS E
INNER JOIN usuario AS U
ON E.id_emprestimo = U.id_usuario
Where E.status_emprestimo = 'ABERTO';
select status_emprestimo from emprestimo;

--------------------------------------------------
--19:
SELECT U.NOME AS USUARIO, COUNT(E.id_emprestimo) AS QTDE_EMPRESTIMO
FROM emprestimo AS E
INNER JOIN usuario AS U
ON E.id_emprestimo = U.id_usuario
GROUP BY E.id_emprestimo, U.nome
ORDER BY QTDE_EMPRESTIMO DESC;

--------------------------------------------------
--20:
SELECT U.NOME AS USUARIO, COUNT(E.id_emprestimo) AS QTDE_EMPRESTIMO
FROM emprestimo AS E
LEFT JOIN usuario AS U
ON U.id_usuario
GROUP BY E.id_emprestimo, U.nome
ORDER BY USUARIO ASC;
-----------------------------------------------------------------------------------------------
-- ============================================================
-- FASE 4 -------------------------------------------------------------------------------------
--------------------------------------------------
-- 21:
start transaction;
insert into emprestimo (id_usuario, id_livro, data_prevista, data_devolucao, status_emprestimo) VALUES
(4, 4, NOW(), NOW(), 'ABERTO' );
-- SET @emprestimo = LAST_INSERT_ID();
update livro
set quantidade_disponivel = quantidade_disponivel - 1
where id_livro = 7;
select id_livro, quantidade_disponivel from livro
where id_livro = 7;
COMMIT;
select * from livro;

--------------------------------------------------
-- 22:
start TRANSACTION;

update livro
set quantidade_disponivel = quantidade_disponivel - 1
where id_livro = 6;
select id_livro, quantidade_disponivel from livro
where id_livro = 6;
COMMIT;
select * from livro;

ROLLBACK;

select id_livro, quantidade_disponivel from livro
where id_livro = 6;
--------------------------------------------------
-- 23:
START TRANSACTION;
update livro
set quantidade_disponivel = quantidade_disponivel - 2
where id_livro = 6;

SAVEPOINT REAJUSTE_estoque;

update livro
set quantidade_disponivel = quantidade_disponivel - 10
where id_livro = 6;
ROLLBACK TO SAVEPOINT REAJUSTE_estoque;
COMMIT;
--------------------------------------------------
--24:
select id_emprestimo, status_emprestimo  from emprestimo;
update emprestimo
set status_emprestimo = 'DEVOLVIDO'
where id_emprestimo = 1;

-- resposta: não é possivel pois o check nao permite eu alteral o valor de status