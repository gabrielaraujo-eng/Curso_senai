print("Bem-Vindo ao GitHub")

# 1.1
# idade = input("Digite sua idade: ")
# if idade >= 18:
#   print("Você é maior de idade.")
# 1.2
# idade = int(input("Digite sua idade: "))
# if idade >= 18:
#     print("Você é maior de idade.")
# 1.3
# idade = int(input("Digite sua idade: "))
# if idade >= 18:
#     print("Você é maior de idade.")
# elif idade >= 13:
#     print("Você é um adolescente.")
# elif idade >= 0:
#     print("Você é uma criança.")
# else:
#     print("Idade inválida.")
# 2.1
# nome = "Mariana"
# print("Seja bem-vinda, nome!")
# 2.2
# nome = "Mariana"
# print(f"Seja bem-vinda, {nome}!")
# 2.3
# nome = input("Digite seu nome: ")
# print(f"Seja bem-vinda, {nome}!")
# 3.1
# numero = 10
# if numero > 5:
# print("O número é maior que cinco.")
# else:
# print("O número é menor ou igual a cinco.")
# 3.2
# numero = 10
# if numero > 5:
#     print("O número é maior que cinco.")
# else:
#     print("O número é menor ou igual a cinco.")
# 3.3
# numero = int(input("Digite um número: "))
# if numero > 5:
#     print("O número é maior que cinco.")
# else:
#     print("O número é menor ou igual a cinco.")
# 4.1
# usuario = "aluno123"
# if usuario == "aluno123"
#     print("Login realizado com sucesso.")
# 4.2
# usuario = "aluno123"
# if usuario == "aluno123":
#     print("Login realizado com sucesso.")
# 4.3
# usuario = input("Digite seu nome de usuário: ")
# usuario = "aluno123"
# if usuario == "aluno123":
#     print("Login realizado com sucesso.")
# else:
#     print("Usuário não encontrado no catalogo.")
# 5.1
# clima= "ensolarado"
# if clima= "chuvoso":
#     print("Leve um guarda-chuva!")
# 5.2
# clima = "ensolarado"
# if clima == "chuvoso":
#     print("Leve um guarda-chuva!")
# 5.3
# clima = input("Digite o clima atual (ensolarado, chuvoso, nublado): ")
# if clima == "chuvoso":
#     print("Leve um guarda-chuva!")
# elif clima == "ensolarado":
#     print("Use protetor solar!")
# elif clima == "nublado":
#     print("Pode ser necessário um casaco leve.")
# else:
#     print("Clima desconhecido. Verifique a previsão do tempo.")
# 6.1
# pontos = 50
# print("Parabéns! Você fez " + pontos + " pontos.")   
# 6.2
# pontos = 50
# print("Parabéns! Você fez ", pontos, " pontos.")  
# 6.3
# pontos = int(input("Digite a quantidade de pontos: "))
# print(f"Parabéns! Você fez {pontos} pontos.")
# 7.1
# O sistema deve dar "Excelente" para notas 9 ou 10.
# nota = 9.5
# if nota >= 7:
#     print("Aprovado")
# elif nota >= 9:
#     print("Excelente!")
# 7.2
# O sistema deve dar "Excelente" para notas 9 ou 10.
# nota = 9.5
# if nota >= 7:
#     print("Aprovado")
# elif nota >= 9:
#     print("Excelente!")
# 7.3
# O sistema deve dar "Excelente" para notas 9 ou 10.
# nota = int(input("Digite a nota do aluno: "))
# if nota >= 9 and nota <= 10:
#     print("Excelente!")
# elif nota >= 7:
#     print("Aprovado")
# elif nota >= 0:
#     print("Reprovado")
# else:   
#     print("Nota inválida.")
# 8.1
# Objetivo: Mostrar na tela os números 1, 2, 3, 4 e 5.
# for i in range(5):
#     print(i)
# 8.2
# Objetivo: Mostrar na tela os números 1, 2, 3, 4 e 5.
# for i in range(1, 6):
#     print(i)
# 8.3
# Objetivo: Mostrar na tela os números 1, 2, 3, 4 e 5.
# numero = int(input("Digite um número que deseje ver todos seus antecessores naturais: "))
# for i in range(numero):
#     print(i+1)
# 9.1
# tentativas = 1
# while tentativas <= 3:
#     print("Tentando conectar...")
# # O código deveria parar após 3 tentativas
# 9.2
# tentativas = 1
# while tentativas <= 3:
#     print("Tentando conectar...")
#     tentativas += 1
# 9.3
# tentativas = 1
# while tentativas <= 3:
#     print("Tentando conectar...")
#     tentativas += 1
# print("Não foi possível conectar após 3 tentativas.")
# opcao = input("Deseja tentar novamente? (s/n): ")
# if opcao == "s":
#     tentativas = 1
#     while tentativas <= 3:
#         print("Tentando conectar...")
#         tentativas += 1
#     print("Não foi possível conectar após 3 tentativas.")
# elif opcao == "n":
#     print("Conexão cancelada pelo usuário.")
# 10.1
# O programa deve pedir a senha até que o usuário digite "python123"
# senha = ""
# while senha == "python123":
#     senha = input("Digite a senha secreta: ")
# print("Acesso concedido!")
# 10.2
# O programa deve pedir a senha até que o usuário digite "python123"
# senha = ""
# while senha != "python123":  
#     senha = input("Digite a senha secreta: ")
# print("Acesso concedido!")
# 10.3
# O programa deve pedir a senha até que o usuário digite "python123"
# senha = input("Digite a senha secreta: ")
# tentativas = 1
# while senha != "python123":
#     print("Senha incorreta. Tente novamente.")
#     senha = input("Digite a senha secreta: ")
#     tentativas += 1
# print(f"Acesso concedido! Você tentou {tentativas} vezes.")
