# Projeto 1:
# Projeto: Precisamos de um algoritmo para gerenciamento de cancelas para um shopping.
# Toda entrada e saída irá ser sinalizada
# Valores para entrada e permanência do veículo deverá ser pergutado 
# As entrada deverão ser registradas por placa. 

# passo 1: definir um sensor que contabiliza qualquer veiculo que entra no shopping.
# passo 2: perguntar se o veiculo deseja entrar no shopping.
# passo 3: registrar a placa do veiculo que entrou no shopping.
# passo 4: perguntar quanto tempo o veiculo permaneceu/quer permanecer no shopping.
# passo 5: calcular o valor a ser pago pelo veiculo com base no tempo de permanência, considerando uma tarifa fixa por hora.
# passo 6: informar todos os dados do veiculo, incluindo a placa, o tempo de permanência e o valor a ser pago para o cliente.




print("=============================================================\n")
print("Bem-vindo ao sistema de gerenciamento de cancelas do shopping!\n")
print("=============================================================\n")
  
numerodoveiculoaentrar = 0
tarifa_por_hora = 9.0
print("qual opção deseja escolher? 1 - sem parar, 2 - tiket")
entrada = input("Deseja entrar no shoppingpor qual opção? 1 ou 2? ")
while True:
    if entrada == "1":
        numerodoveiculoaentrar += 1
        
        placa = input(f"Digite a placa do veículo {numerodoveiculoaentrar}: ")
        tempo = float(input("Digite o horario atual: "))
        saida = float(input("Digite o horario de saída: "))
        valor = (saida - tempo) * tarifa_por_hora
    
        print(f"\n----- Dados do Veículo -----")
        print(f"Placa: {placa}")
        print(f"Tempo de permanência: {saida - tempo} horas")
        print(f"Valor a pagar: R${valor}")
        print(f"Você é o {numerodoveiculoaentrar}º veículo a entrar no shopping.\n")
        print("\nEncerrando o sistema. Tenha um bom dia!")
        break

    else:
        print("Opção inválida! Digite '1' ou '2'.\n")
        break

while True:
    if entrada == "2":
        numerodoveiculoaentrar += 1
        
        placa = input(f"Digite a placa do veículo {numerodoveiculoaentrar}: ")
        tempo = float(input("Digite o horario atual: "))
        saida = float(input("Digite o horario de saída: "))
        valor = (saida - tempo) * tarifa_por_hora
    
        print(f"\n----- Dados do Veículo -----")
        print(f"Placa: {placa}")
        print(f"Tempo de permanência: {saida - tempo} horas")
        print(f"Valor a pagar: R${valor}")
        print(f"Você é o {numerodoveiculoaentrar}º veículo a entrar no shopping.\n")
        print("qual a forma de pagamento? 1 - dinheiro, 2 - cartão")
        pagamento = input("Escolha a forma de pagamento: 1 ou 2? ")
        if pagamento == "1":
            print("Pagamento em dinheiro selecionado. Por favor, dirija-se ao caixa para efetuar o pagamento.")
            break
        elif pagamento == "2":
            print("Pagamento com cartão selecionado. Por favor, dirija-se ao caixa para efetuar o pagamento.")
            break
        else:
            print("Opção de pagamento inválida! Por favor, escolha 1 ou 2.\n")
            break
        
        
        
        
