dobro n = n * 2

main = do
    putStrLn "Digite um número:"
    putStrLn "mostratrei o dobro dele"
    input <- getLine
    let n = read input :: Int
    putStrLn "resultado: "
    print (dobro n)