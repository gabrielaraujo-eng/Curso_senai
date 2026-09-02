while True:
    print("=============================")
    print("1 multiplique dois numeros")
    print("2 some dois numeros")
    print("3 meu numero e par ou impar")
    print("4 qual seu nome")
    print("5 subtraia dois numeros")
    print("6 divida dois numeros")
    print("7 encerar o programa")
    print()
    opcao = input("escolha:\n")
    print("=============================")
    
    if opcao == "1":
        numero = int(input("digite um dos numeros"))
        print()
        numerodois = int(input("digite outro numero"))
        print()
        print("o produto dos numeros e", numero * numerodois)
        print()
    elif opcao == "7":
        print("operacao encerada!")
        break
    elif opcao == "3":
        numero = int(input("digite um dos numeros "))
        print()
        if numero % 2 == 0:
            print("esse numero e PAR")
            print()
        else:
            print("esse numero e IMPAR")
            print()
           
    elif opcao == "4":
       print()
       nome = input("qual seu nome?" )
       print()
       print("com o poder que foi dado a mim,")
       print("seu nome e", nome)
       print()
    
    elif opcao == "2":
        nume = int(input("digite o numero"))
        print()
        nume_dois = int(input("digite o outro numero"))
        print()
        print("a soma dos numeros resulta em", nume + nume_dois)  
   
    elif opcao == "5":
        subtraia = int(input("digite o numero"))
        print()
        subtraia_dois = int(input("digite outro numero"))
        print()
        print("a subtracao dos numeros e", subtraia - subtraia_dois)
    elif opcao == "6":
        dividir = int(input("digite o numero"))
        print()
        dividir_d = int(input("digite outro numero"))
        print()
        print("a divisao dos numeros e", dividir / dividir_d)
        print()
    else:
        pensar = input("voce sabe escolher entre 1 e 7?")
        if pensar == "sim":
            print()
            print("entao escolha certo")
        elif pensar == "nao":
            print()
            print("entao escolha 7 e saia daqui")
        else:
            print()
            print("Escolha uma opcao valida")
