# logicas e decisoes 
# se condicao verdadeira
# se ainda condicao ainda verdadeira porem com criterios
# senao condicao falsa
# if elif e else
# sinais de > < =

# exemplo 1
print("verificar idade")
idade = int(input("digite sua idade"))

if idade >= 18:
    print("Voce e maior de idade")
elif idade >= 16:
    print("voce nao e de maior porem pode votar")
else:
    print("voce nao e maior de idade")

# exemplo 2
# valores
print("checar valores")
valor = int(input("digite um valor"))

if valor > 100:
    v1 = valor + 1
    print("valores acima de 100", v1)

else:
    print("valores abaixo de 100")

# exemplo 3 
# criar um algoritmo que permita escolher a opcao que deseja                      /2
print("menu de opçao")
print("escolha uma das opcoes")
print("filme F e series S")
escolha = input("digite uma opçao")

if escolha == "F":
    print("voce escolheu filmes")
elif escolha == "S":
    print("voce escolheu series")
else:
    print("voce saiu do programa")

