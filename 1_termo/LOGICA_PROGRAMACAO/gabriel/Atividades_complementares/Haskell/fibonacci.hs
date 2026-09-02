fib 0 = 0
fib 1 = 1
fib n = fib (n - 1) + fib(n - 2)

main = do
    putStrLn "mostro um termo N da sequencia de fibonacci"
    putStrLn "digite um numero: "
    input <- getLine
    let n = read input :: Int
    print (fib n)