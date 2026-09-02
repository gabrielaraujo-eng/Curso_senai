quadrado n = n * n

main = do
    putStrLn "mostro o quadrado de qualquer numero N"
    putStrLn "digite um numero: "
    input <- getLine
    let n = read input :: Int
    print (quadrado n)