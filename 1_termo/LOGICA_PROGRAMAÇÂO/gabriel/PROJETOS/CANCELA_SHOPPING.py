# Projeto 1:
# Projeto: Precisamos de um algoritmo para gerenciamento de cancelas para um shopping.
# Toda entrada e saída irá ser sinalizada
# Valores para entrada e permanência do veículo deverá ser pergutado
# As entrada deverão ser registradas por placa.
#
# Passo 1:  
# Perguntar informações sobre o veiculo ou forma acesso
# Pressionar o botao para emitir ticket
# Verificar se possui TAG para acesso liberado
# Se possuir erros informar ao usuário

# Passo 2:
# Verificar tempo de permanência
# Valor a ser cobrado

# Passo 3:
# Saída como será?
# Calcular tempo de permanência
# Se for TAG gerar na fatura da TAG
# Pagar ticket
# Devolver ticket na saída

# Passo 4:
# Gerar relatório de entradas e saídas
# Tratamento de Erros
# Revisão do código

print("=============================================================")
print("Bem-vindo ao sistema de gerenciamento de cancelas do shopping!")
print("=============================================================")

numerodoveiculo = 0
tarifa_por_hora = 9.0

while True:
    print("\nEscolha uma opção:")
    print("1 - Sem parar (TAG)")
    print("2 - Ticket")
    print("0 - Encerrar sistema")
    print("3 - Erros comuns")
    
    entrada = input("Opção: ")

    if entrada == "0":
        print("Encerrando o sistema...")
        break
    
    elif entrada == "3":
        print("Erros comuns:")
        print("1 - Horário de saída menor que horário de entrada.")
        print("2 - Opção de pagamento inválida.")
        print("3 - Placa do veículo não informada.")
        print("4 - Tempo de permanência negativo.")
        print("5 - Opção de acesso inválida.")
        print("6 - TAG não cadastrada.")
        print("Escolha um número para obter detalhes sobre o erro ou 0 para voltar ao menu principal.")
        print("0 - Voltar ao menu principal")
        print("para melhor auxílio entre em contato com o suporte 19 99999-9999")

        erro = input("Digite o número do erro para mais detalhes: ")
        if erro == "1":
            print("Erro: O horário de saída não pode ser menor que o horário de entrada. Verifique os horários informados.")
        elif erro == "2":
            print("Erro: Opção de pagamento inválida. Certifique-se de escolher uma forma de pagamento válida.")
        elif erro == "3":
            print("Erro: Placa do veículo não informada. Por favor, informe a placa para registrar a entrada ou saída.")
        elif erro == "4":
            print("Erro: Tempo de permanência negativo. Verifique os horários informados para calcular corretamente o tempo de permanência.")
        elif erro == "5":
            print("Erro: Opção de acesso inválida. Escolha entre 'Sem parar (TAG)' ou 'Ticket' para acessar o sistema.")
        elif erro == "6":
            print("Erro: TAG não cadastrada. Verifique se a TAG está cadastrada no sistema para acesso sem parar.")
        elif erro == "0":
            print("Voltando ao menu principal...")
        else:
            print("Número de erro inválido. Por favor, escolha um número válido para obter detalhes sobre os erros comuns.")

    elif entrada == "1" or entrada == "2":
        numerodoveiculo += 1
        
        placa = input(f"Digite a placa do veículo {numerodoveiculo}: ")
        
        tempo = float(input("Digite o horário de entrada: "))
        saida = float(input("Digite o horário de saída: "))

        if saida < tempo:
            print("Erro: horário de saída menor que entrada!")
            continue

        permanencia = saida - tempo
        valor = permanencia * tarifa_por_hora

        print("\n----- Dados do Veículo -----")
        print(f"Placa: {placa}")
        print(f"Tempo de permanência: {permanencia} horas")
        print(f"Valor a pagar: R${valor:.2f}")
        print(f"Veículo número: {numerodoveiculo}")

        if entrada == "1":
            print("Cobrança será feita automaticamente na TAG.")
            print(f"Obrigado pela preferência, volte sempre! veiculo numero {numerodoveiculo}")

        elif entrada == "2":
            print("Forma de pagamento:")
            print("1 - Dinheiro")
            print("2 - Cartão")
            print("3 - Pix")

            pagamento = input("Escolha: ")

            if pagamento == "1":
                print("Pagamento em dinheiro selecionado.")
                print(f"Valor a pagar: R${valor}. Dirija-se ao caixa para efetuar o pagamento.")
                print(f"Obrigado pela preferência, volte sempre! veiculo numero {numerodoveiculo}")
            elif pagamento == "2":
                print("Pagamento com cartão selecionado.")
                print("1 debito ou 2 credito?")
                cartao = input("Escolha: ")
                if cartao == "1":
                    print("Pagamento no débito selecionado.")
                    print(f"Obrigado pela escolha, volte sempre! veiculo numero {numerodoveiculo}")
                elif cartao == "2":
                    print("Pagamento no crédito selecionado.")
                    print(f"Obrigado pela escolha, volte sempre! veiculo numero {numerodoveiculo}")
            elif pagamento == "3":
                print("Pagamento via Pix selecionado.")
                print(f"Valor a pagar: R${valor}. Use o QR code ou chave Pix para efetuar o pagamento.")
                print(f"Obrigado pela preferência, volte sempre! veiculo numero {numerodoveiculo}")

            else:
                print("Opção inválida de pagamento.")

    else:
        print("Opção inválida! Tente novamente.")