-- Dada a sequencia, descubra a regra geradora.
--1, 4, 7, 10, 13, 16, 19, 22, 25, 28

sequencia n = 3 * n - 2

main = do
    print (map sequencia[1..10])