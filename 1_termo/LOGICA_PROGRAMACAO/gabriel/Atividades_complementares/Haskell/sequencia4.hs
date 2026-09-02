-- descobrir a regra.
-- 2, 6, 12, 20, 30, 42, 56, 72, 90, 110

sequencia n = n * (n + 1)

main = do 
    print (map sequencia [1..10])
