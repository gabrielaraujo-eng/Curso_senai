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
    
    entrada = input("Opção: ")

    if entrada == "0":
        print("Encerrando o sistema...")
        break

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

        elif entrada == "2":
            print("Forma de pagamento:")
            print("1 - Dinheiro")
            print("2 - Cartão")
            print("3 - Pix")

            pagamento = input("Escolha: ")

            if pagamento == "1":
                print("Pagamento em dinheiro selecionado.")
                print(f"Valor a pagar: R${valor}. Dirija-se ao caixa para efetuar o pagamento.")
                print("Obrigado pela preferência, volte sempre!")
            elif pagamento == "2":
                print("Pagamento com cartão selecionado.")
                print("1 debito ou 2 credito?")
                cartao = input("Escolha: ")
                if cartao == "1":
                    print("Pagamento no débito selecionado.")
                    print("obrigado pela escolha volte sempre")
                elif cartao == "2":
                    print("Pagamento no crédito selecionado.")
                    print("obrigado pela escolha volte sempre")
            elif pagamento == "3":
                print("Pagamento via Pix selecionado.")
                print(f"Valor a pagar: R${valor}. Use o QR code ou chave Pix para efetuar o pagamento.")
                print("Obrigado pela preferência, volte sempre!")
            else:
                print("Opção inválida de pagamento.")

    else:
        print("Opção inválida! Tente novamente.")
