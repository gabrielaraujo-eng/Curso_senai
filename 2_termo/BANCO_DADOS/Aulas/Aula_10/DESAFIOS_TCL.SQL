-- ATIVIDADE PRATICA - AULA 10
-- Aluno(a): GABRIEL LÚCIO
-- Regra: valide sempre antes de COMMIT.

-- 01. Consulte produto 2 e seu preço.
START TRANSACTION;
SELECT NOME, PRECO FROM produto
WHERE id_produto = 2;
COMMIT;
-- 02. START TRANSACTION e aumente produto 2 em R$3,00.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO + 348
WHERE ID_PRODUTO = 2;



-- 03. Consulte dentro da transação.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO + 348
WHERE ID_PRODUTO = 2;
SELECT ID_PRODUTO, PRECO, NOME FROM PRODUTO
WHERE ID_PRODUTO = 2;

-- 04. ROLLBACK.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO + 348
WHERE ID_PRODUTO = 2;
ROLLBACK;
SELECT ID_PRODUTO, PRECO, NOME FROM PRODUTO
WHERE ID_PRODUTO = 2;
-- 05. Consulte e comprove retorno.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO + 348
WHERE ID_PRODUTO = 2;
ROLLBACK;
SELECT ID_PRODUTO, PRECO, NOME FROM PRODUTO
WHERE ID_PRODUTO = 2;

-- 06. Repita a alteração e finalize com COMMIT.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO + 348
WHERE ID_PRODUTO = 2;
COMMIT;
SELECT ID_PRODUTO, PRECO, NOME FROM PRODUTO
WHERE ID_PRODUTO = 2;

-- 07. START TRANSACTION e aumente produto 3 em 10%.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO * 1.1
WHERE ID_PRODUTO = 3;


-- 08. SAVEPOINT ajuste_produto3.
SAVEPOINT AJUSTE_PRODUTO3;

-- 09. Aumente produto 4 em 50%.
START TRANSACTION;
UPDATE produto
SET PRECO = PRECO * 1.5
WHERE ID_PRODUTO = 4;

-- 10. Consulte os dois.
SELECT * FROM produto
WHERE ID_PRODUTO IN (4, 3);


-- 11. ROLLBACK TO SAVEPOINT ajuste_produto3.
ROLLBACK TO SAVEPOINT AJUSTE_PRODUTO3;

-- 12. COMMIT e explique em comentário qual alteração permaneceu.


-- 13. START TRANSACTION.

-- 14. Crie pedido para cliente 1 e salve o id em @novo_pedido.

-- 15. Insira dois itens válidos.

-- 16. Registre pagamento válido.

-- 17. Consulte pedido, itens e pagamento.

-- 18. COMMIT.

-- 19. START TRANSACTION e crie pedido para cliente 2.

-- 20. Salve o id em @pedido_com_erro.

-- 21. Tente inserir item com id_produto inexistente.

-- 22. Após observar a FK, ROLLBACK.

-- 23. Consulte @pedido_com_erro e comprove que não permaneceu.

-- 24. Tente excluir uma categoria que possui produtos.
-- Explique em comentário por que foi bloqueado.

-- 25. Crie em uma transação um pedido temporário com dois itens,
-- exclua o pedido e observe ON DELETE CASCADE.
-- Finalize com ROLLBACK para preservar a base.

-- DESAFIO EXTRA - CAIXA DO SMARTCOFFEE
-- Em UMA transação:
-- a) pedido; b) 3 itens; c) baixa de estoque;
-- d) SAVEPOINT; e) pagamento; f) status FINALIZADO;
-- g) consultas; h) COMMIT.