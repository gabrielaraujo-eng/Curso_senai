numero_secreto = 77
print("___________________________________")
print("Jogo de adivinhar o numero")
print("tente descobrir o numero de 1 a 100")
print("___________________________________")

while True:
    tentativa = int(input("digite um numero\n"))
    print()
    if tentativa == numero_secreto:
        print("Voce acertou o numero *secreto*")
        break
    elif tentativa < numero_secreto:
        print("DICA o numero e ^maior^ que esse\n")
    elif tentativa > numero_secreto:
        print("DICA o numero e <menor< que esse\n")
    else:
        print("tente novamente")
             
    
        
