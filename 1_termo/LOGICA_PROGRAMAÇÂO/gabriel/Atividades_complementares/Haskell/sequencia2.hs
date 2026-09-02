-- Descobrir a regra e montar em Haskell.
-- 2, 3, 5, 9, 17, 33, 65, 129, 257, 513

sequencia n = 2^(n-1) + 1
main = do 
    print (map sequencia [1..10])