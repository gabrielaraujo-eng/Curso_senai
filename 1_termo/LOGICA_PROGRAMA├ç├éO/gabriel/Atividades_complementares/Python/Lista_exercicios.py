# 1 Faça um programa que peça o nome do usuário e exiba:

# nome = input("Qual seu nome?: ")
# print(f"Seja bem vindo {nome}")

# 2 Peça um número e mostre o dobro dele.

# numero = int(input("Digite um numero e direi o dobro dele: "))
# dobro = 2 * numero
# print(f"O dobro de {numero} é {dobro}")

# 3 Peça dois números e mostre a soma.

# print("Faço a soma de dois numeros da sua escolha")
# numero1 = int(input("Digite um numero: "))
# numero2 = int(input("Digite outro numero: "))

# soma = numero1 + numero2 

# print(f"A soma de {numero1} com {numero2} é {soma}")

# 4 Peça a idade de uma pessoa e informe quantos anos ela terá daqui a 10 anos.

# print("Falo a idade que voce tera daqui 10 anos")
# idade = int(input("Qual sua idade?: "))

# idade_futura = idade + 10

# print(f"Tendo hoje {idade} anos, voce tera em 10 anos: {idade_futura} anos")

# 5 Peça um número e informe se ele é positivo, negativo ou zero.

# numero = float(input("Digite um numero: "))

# if numero > 0:
#     print("Este numero é positivo")
# elif numero < 0:
#     print("Este numero é negativo")
# else:
#     print("Este numero é zero")

# 6 Peça a nota de um aluno.
# Nota ≥ 7 → Aprovado
# Nota < 7 → Reprovado

# nota = float(input("Qual a sua nota?: "))

# if nota >= 7:
#     print("Aprovado")
# else: 
#     print("Reprovado")

# 7 Peça um número e diga se ele é par ou ímpar.

# numero = float(input("Digite um numero: "))
# if numero % 2 == 0:
#     print("Este numero é par")
# else:
#     print("Este numero é impar")

# 8 Peça a idade de uma pessoa.
# Menor que 18 → Menor de idade
# 18 ou mais → Maior de idade

# idade = int(input("Qual sua idade?: "))
# if idade >= 18:
#     print("Voce é maior de idade")
# else:
#     print("Voce é menor de idade")

# 9 Peça três números e mostre o maior deles.

# n1 = float(input("Digite um numero 1: "))
# n2 = float(input("Digite um numero 2: "))
# n3 = float(input("Digite um numero 3: "))

# lista = [n1,n2,n3]
# maior_valor = max(lista)
# print(f"O miaior valor é {maior_valor}")

# ou

# lista = []
# for i in range(1, 4):
#     numero = float(input(f"Digite um numero {i}:"))
#     lista.append(numero)
#     maior_valor = max(lista)
# print(f"O maior valor é {maior_valor}")

# 10 Crie um sistema de login simples:
# usuario = "admin"
# senha = "1234"

# usuario = "admin"
# senha = "1234"

# usuario_1 = input("Qual seu nome de usuario?: ")
# senha_1 = input("Qual sua senha?: ")

# if usuario_1 == usuario and senha_1 == senha:
#     print("Acesso consedido")
# else:
#     print("acesso negado")

# 11 Mostre os números de 1 até 10 usando while.

# termo = 0
# while termo <= 10:
#     print(f"{termo}")
#     termo += 1

# 12 Mostre os números de 10 até 1.
# termo = 10
# while termo >= 0:
#     print(f"{termo}")
#     termo -= 1

# continua..