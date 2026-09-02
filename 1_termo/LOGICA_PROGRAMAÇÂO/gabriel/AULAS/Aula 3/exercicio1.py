# exercicio 1 
# criar um algoritmo realizar a locaçao de filmes ou series seguir o modelo anterior. ao escolher a opçao voce devera perguntar o nome do cliente do filme ou serie e quantidade que deseja assim como o valor do aluguel 
# para filmes 5rs e para series 10rs
print("===============================================")
print("sou um algortimo de locaçao de filme e series")
print("menu de opçaoF")
print("escolha uma das opcoes")
print("filme F e series S")
print("===============================================")
escolha = input("digite uma opçao  ")

if escolha == "F":
    print("voce escolheu filmes\n")
    nome = input("qual seu nome ")
    n1 = input("qual o nome do filme ")
    print("\no valor e 5 reais", nome, "e voce escolheu", n1, "\n") 
elif escolha == "S":
    print("voce escolheu serie\n")
    nome = input("qual seu nome ")
    n2 = input("qual o nome da serie ")
    print("\no valor e 10 reais,", nome, "e voce escolheu", n2, "\n")  
else:
    print("\nvoce saiu do programa")
