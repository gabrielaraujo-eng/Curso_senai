-- Descobrir a regra.
--3, 8, 15, 24, 35, 48, 63, 80, 99, 120

sequencia n = n * (n + 2) 

main = do 
    print (map sequencia [1..10])