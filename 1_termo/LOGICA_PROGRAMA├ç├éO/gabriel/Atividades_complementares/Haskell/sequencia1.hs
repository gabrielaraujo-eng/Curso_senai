-- "Dada a sequencia de f(1) -> f(10), cria uma formula irredutivel."
-- 1, 2, 4, 8, 16, 32, 64, 128, 256, 512

sequencia 1 = 1
sequencia n = sequencia (n - 1) * 2

main = do
    putStrLn "Mostro um termo N da sequencia"
    putStrLn "digite um numero: "
    input <- getLine
    let n = read input :: Int
    putStrLn "resultado: "
    print (sequencia n)