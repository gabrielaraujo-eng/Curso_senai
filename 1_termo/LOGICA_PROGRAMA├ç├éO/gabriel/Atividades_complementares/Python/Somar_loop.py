while True:
    print("======================")
    print("1 somar dois numeros")
    print("2 sair")
    print("======================")
    
    opcao = input("escolha: ")
    
    if opcao == "1":
        Numero = int(input("digite um numero "))
        print()
        NumeroDois = int(input("digite outro numero "))
        print()
        print("A soma dos numeros escolhidos é", Numero + NumeroDois)
        print()
        
    elif opcao == "2":
        print()
        print("operacao finalizada!")
        break
        
    else:
        print("escolha uma opcao valida")
        print()
