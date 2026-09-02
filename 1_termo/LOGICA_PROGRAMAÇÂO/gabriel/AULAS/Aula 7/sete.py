#clean code - aula 7
#para que usar?
# #como usar?
# print("Clean Code - Aula 7")
# aula = 7
# print(f"Estamos na aula {aula} de Clean Code")

# #manipulação de arquivos e texto
# manipular_texto = " python é Muito legal "
# print(manipular_texto.strip().upper()) #"PYTHON"
# print(manipular_texto.strip().lower()) #"python"
# print(manipular_texto.strip().startswith("A")) # Começar com a letra A
# print(manipular_texto.strip().capitalize()) #"letras iniciais"
# print(manipular_texto.strip().title()) # titulo
# print(manipular_texto.strip().replace(" ", "_")) # Preencher vazios
# print(manipular_texto.strip().split()) # Separar em palavras

# # exercicio 1:
# #crie um programa que peça ao usuario para inserir uma frase e, em seguida, exiba a frase com as seguintes transformações:
# # - Deixe o texto em letras maiúsculas
# frase = input("Digite uma frase: ") #print(frase.upper())
# print(frase.strip().upper())

# Manipular Arquivos
#  # escrevendo
# with open("notas.txt", "w", encoding="utf-8") as texto:
#     texto.write("Estudar Python hoje!")
#     texto.write("\nLer sobre Clean Code")
#     texto.write("\n Estamos evoluindo.")

# # # lendo
# with open("notas.txt", "r", encoding="utf-8") as texto:
#     conteudo = texto.read()
#     print(conteudo)

# #exemplo 1:
# # Crie um programa que escreva uma lista de tarefas em um 
# # arquivo de texto e conte quantas vezes a palavra "python" aparece no arquivo. Exiba o resultado para o usuário.
# with open("notas.txt", "r", encoding="utf-8") as texto:
#     conteudo = texto.read()
#     contador = conteudo.count("python")
#     print(f"A palavra 'python' aparece {contador} vezes no arquivo.")
    
#     # contador = conteudo.upper()
#     # qualquer_coisa = contador.count("PYTHON")
#     # print(f"A palavra 'python' aparece {qualquer_coisa} vezes no arquivo.")

# # a = b = c
# # a = c

# print("Contagem de palavras em arquivo")
# with open("notas.txt", "r", encoding="utf-8") as texto:
#     conteudo = texto.read()
#     contagem = conteudo.count("Python")
#     contagem = conteudo.upper().count("PYTHON") # Contar a palavra "Python"
#     contagem = conteudo.lower().count("python")
#     print(f"A contagem de palavras {contagem} é de...")


# Interação com o sistema operacional
import os # importa o módulo os para interagir com o sistema operacional

# Onde estou?
print(os.getcwd())
print(os.listdir())
print(os.listdir("C:/Users"))

# Criar pastas
# os.mkdir("Nova_Pastaa")
# Criar arquivos

# Renomear pastas
os.rename("Nova_Pastaa", "Minha_Pastaa")

# Apagar pastas
os.rmdir("Minha_Pastaa")
# os.remove("notas.txt") #Excluir arquivos
