print("sou um algoritmo para compras dde produtos")
print("menu de opçoes")
print("1 - comida")
print("2 - bebida")
print("3 - doces")
escolha = int(input("qual opçao deseja "))

if escolha == 1:
    valor = int(input("quanto voce quer comprar de comida "))
    pc = valor / 100 * 90
    print("comida tem 10% de desconto")
    print("total da compra foi ", pc, "obrigado por comprar")

elif escolha == 2:
    valor2 = int(input("quanto voce quer comprar de bebida "))
    pc2 = valor2 / 100 * 95
    print("bebida tem 5% de desconto")
    print("total da compra foi ", pc2, "obrigado por comprar")

elif escolha == 3:
    valor3 = int(input("quanto voce quer comprar de bebida "))
    pc3 = valor3 / 100 * 98
    print("doces tem 2% de desconto")
    print("total da compra foi ", pc3, "obrigado por comprar")

else:
    print("escolha uma opcao valida")

