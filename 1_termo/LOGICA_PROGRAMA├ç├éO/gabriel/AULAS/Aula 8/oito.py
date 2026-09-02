#tratamento de erros e execuções
#
# O código acima pode gerar um erro de divisão 
# por zero se o usuário digitar 0 para o segundo valor. 
# Para tratar esse erro, podemos usar um bloco try-except:

# Exemplo 1: Tratamento de divisão por zero
# try:
#     valor1 = int(input("Digite o primeiro valor: "))
#     valor2 = int(input("Digite o segundo valor: "))
#     resultado = valor1 / valor2
#     print(f"o resultado da divisão é: {resultado}")
# except ZeroDivisionError:
#     print("Erro: Divisão por zero não é permitida.")

# Exemplo 2: Tratamento de entrada inválida
# try:
#     valor1 = int(input("Digite o primeiro valor: "))
#     valor2 = int(input("Digite o segundo valor: "))
#     resultado = valor1 / valor2
#     print(f"O resultado da divisão é: {resultado}")
# except ValueError:
#     print("Erro de valor: Por favor, digite um número inteiro válido.")
# except ZeroDivisionError:
#     print("Erro: Não é possível dividir por zero.")

# Exemplo 3: Tratamento de múltiplas exceções
# try:
#     valor1 = int(input("Digite o primeiro valor: "))
#     valor2 = int(input("Digite o segundo valor: "))
#     resultado = valor1 / valor2
#     print(f"O resultado da divisão é: {resultado}")
# except (ValueError, ZeroDivisionError) as e:
#     print(f"Ocorreu um erro: {e}") and print(f"Erro de valor: Por favor, digite um número inteiro válido. {e} ou Erro: Não é possível dividir por zero. {e}")

# Exemplo 4: Uso do bloco finally 1 e 2
# while True:
#     try:
#         valor1 = int(input("Digite o primeiro valor: "))
#         valor2 = int(input("Digite o segundo valor: "))
#         resultado = valor1 / valor2
#         print(f"O resultado da divisão é: {resultado}")
#     except (ValueError, ZeroDivisionError) as e:
#         print(f"Erro de valor: Por favor, digite um número inteiro válido. {e} ou Erro: Não é possível dividir por zero. {e}")
#     finally:
#         print("Bloco finally executado.")
#     break

# try:
#     valor1 = int(input("Digite o primeiro valor: "))
#     valor2 = int(input("Digite o segundo valor: "))
#     resultado = valor1 / valor2
#     print(f"O resultado da divisão é: {resultado}")
# except (ValueError, ZeroDivisionError) as e:
#     print(f"Erro de value: Por favor, digite um número inteiro válido. {e} ou Erro: Não é possível dividir por zero. {e}")
# finally:
#     print("Bloco finally executado.")

# Exemplo 5: TypeError
# try:
#     resultado = "5" + 10
# except TypeError as e:
#     print(f"Erro de tipo: {e}")

# print("=============================================================\n")
# print("Bem-vindo ao sistema de gerenciamento de cancelas do shopping!\n")
# print("=============================================================\n")
    
# numerodoveiculoaentrar = 0
# while True:
#     entrada = input("Deseja entrar no shopping? (s/n): ")
#     if entrada == "s":
#         numero_total = numerodoveiculoaentrar
#         placa = input(f"Digite a placa do veículo {numero_total}: ")
#         valor_de_permanencia = float(input("Digite o tempo de permanência em horas [cada hora é 9 reais]: ")) * 9.0
#         print(f"Valor de permanência para o veículo com placa {placa} é: R${valor_de_permanencia}")
#         print(f"voce é o veiculo de placa {placa} que entrou no shopping.")
#         print(f"voce é o {numero_total+1}º veículo a entrar no shopping.")

#     else:
#         print("Saída do shopping. Tenha um bom dia!")
        # break
