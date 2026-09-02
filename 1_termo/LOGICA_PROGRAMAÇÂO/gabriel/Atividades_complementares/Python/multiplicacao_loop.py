while True:
    print("======")
    print("1 multiplique dois numeros")
    print("2 encerar")
    print("======")
    
    opcao = input("escolha:\n")
    
    if opcao == "1":
        numero = int(input("digite o numero"))
        print()
        numerodois = int(input("digite outro numero"))
        print()
        print("o produto dos numeros e", numero * numerodois)
        print()
    elif opcao == "2":
        print("operacao encerada!")
        break
    else:
        print("escolha um opcao valida")
