main = do   
    putStrLn "digo se um numero é par ou impar"
    putStrLn "Numero: "
    input <- getLine

    let n = read input :: Int

    if (n `div` 2) * 2 == n  
        then putStrLn "par"
        else putStrLn "impar"