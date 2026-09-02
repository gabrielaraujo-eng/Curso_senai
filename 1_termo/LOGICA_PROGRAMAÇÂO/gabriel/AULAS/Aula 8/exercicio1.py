# Exercicio 1:
# Crie um algoritmo que pergunte o seu nome e trate erro ao inserir valores incorretos
# try:
#     seu_nome = str(input("qual seu nome: "))
#     print(f"seu nome é {seu_nome}")
# except Exception as e:
#     print(f"erro: {e} não é um nome válido.")

primeiro_nome = input("Digite seu primeiro nome: ")
sobrenome = input("Digite seu sobrenome: ")
try:
    nome_completo = f"{primeiro_nome} {sobrenome}"
    print(f"Olá, {nome_completo}!")
except Exception as e:
    print(f"Ocorreu um erro: {e}")

# nome_seu = input("Digite seu nome: ")
# if nome_seu == str:
#     print(f"Olá, {nome_seu}!")
# else:    
#     print("Erro: O valor inserido não é um nome válido.")