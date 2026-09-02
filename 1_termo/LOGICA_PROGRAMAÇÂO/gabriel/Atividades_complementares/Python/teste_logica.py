while True:
    print("somar dois numero")
    print("sair")
    
    opcao = input("escolha: ")
    
    if opcao == "1":
        Numero = int(input("digite um numero "))
        NumeroDois = int(input("digite outro numero "))
        print(Numero + NumeroDois)
        
    elif opcao == "2":
        break
