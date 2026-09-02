# Tratamento de Erros e Depuração
# try e except são usados para lidar com erros de forma controlada, 
# evitando que o programa quebre. O código dentro do bloco try é executado normalmente, mas se ocorrer um erro, o controle é passado
#  para o bloco except, onde você pode lidar com o erro de maneira apropriada.

# try:
#     numero = int(input("Digite um número: "))
#     resultado = 10 / numero
#     print(f"O resultado da divisão é: {resultado}")

# except ValueError:
#     print("Erro: Você deve digitar um número inteiro válido.")

# except ZeroDivisionError:
#     print("Erro: Não é possível dividir por zero. O número deve ser diferente de zero.")

# except KeyboardInterrupt:
#     print("Erro: A entrada foi interrompida pelo usuário.")

# except Exception as error:
#     print(f"Ocorreu um erro inesperado: {error}")

# exercicio 1 
# escreva um programa que solicite ao usuario calcule a media de tres
# numeros. O programa deve lidar com possiveis erros, como a entrada de valores nao numericos ou a divisao por zero.
# while True:
#     try:
#         num1 = float(input("Digite o primeiro número: "))
#         num2 = float(input("Digite o segundo número: "))
#         num3 = float(input("Digite o terceiro número: ")) 
#         media = (num1 + num2 + num3) / 3
#         print(f"A média simples dos números é: {media}")
#     except ValueError:
#         print("Erro: Você deve digitar um número válido.")
#     except ZeroDivisionError:
#         print("Erro: Não é possível dividir por zero. O número deve ser diferente de zero.")

# Explicação de def: A palavra-chave def é usada para definir uma função em Python. Uma função é um bloco de código reutilizável que realiza uma tarefa específica.
# a palavra-chave "return" é usada para finalizar a execução de uma função e retornar um valor para o local onde a função foi chamada o valor retornado pode ser usado posteriormente no código.

# def nome_da_funcao(parametros1, parametros2):
#     # corpo da função (código que a função executa)
#     resultado = parametros1 + parametros2
#     return resultado  

# exemplo 1
# def saudação(nome, idade):
#     nome = input("Digite seu nome: ")
#     idade = int(input("Digite sua idade: "))
#     return f"Olá, {nome}! Você tem {idade} anos."
# print(saudação("", ""))

# exemplo 2
# def calcular_media(num1, num2, num3):
    # try:
    #     media = (num1 + num2 + num3) / 3
    #     return media
    # except TypeError:
    #     return "Erro: Todos os parâmetros devem ser números."
    # except ZeroDivisionError:
    #     return "Erro: Não é possível dividir por zero. O número deve ser diferente de zero." 
# print(calcular_media(10, 20, 30))

# exemplo 3
# def valores():
#     print("Digite tres valores:")
#     a = float(input("Valor 1: "))
#     b = float(input("Valor 2: "))
#     c = float(input("Valor 3: "))
#     return a, b, c
#print(f"O maior valor é: {max(valores())}")

# exemplo 4
# calcule o doblo de um numero fornecido pelo usuario tratando erros de entrada invalida
def calcular_dobro():
    try:
        numero = float(input("Digite um número: "))
        total_dobro = numero * 2
        return total_dobro
    except ValueError:
        print("Erro: Você deve digitar um número válido.")
        return None 
print(f"O dobro do número é: {calcular_dobro()}")
