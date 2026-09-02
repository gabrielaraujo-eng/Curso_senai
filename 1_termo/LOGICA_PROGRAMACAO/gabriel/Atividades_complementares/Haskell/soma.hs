main = do 
    putStrLn "Faço a soma entre dois numeros"
    putStrLn "Numero: "
    a <- getLine
    putStrLn "Numero: "
    b <- getLine

    let x = read a :: Int
    let y = read b :: Int
    let soma = x + y
    putStrLn ("a soma dos numeros é " ++ show soma)