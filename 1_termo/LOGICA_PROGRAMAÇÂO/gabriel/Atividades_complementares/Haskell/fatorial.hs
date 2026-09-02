fac 0 = 1
fac 1 = 1

fac n = n * fac (n - 1)

main = do
    putStrLn "mostro o fatorial de qualquer numero N"
    putStrLn "digite um numero: "
    input <- getLine
    let n = read input :: Int
    print (fac n)