# Sistema de Elevador de Prédio
# O prédio possui 10 andares, sendo o térreo o andar 0. O elevador pode se mover para cima ou para baixo, e tem a capacidade de transportar até 5 pessoas.
# O elevador começa no andar 0 e pode ser chamado por qualquer pessoa em qualquer andar.
# O elevador deve se mover para o andar onde a pessoa chamou, e depois para o andar destino da pessoa.
# O elevador deve exibir mensagens indicando o andar atual, o número de pessoas no elevador, e as ações realizadas (subindo, descendo, parando). O programa deve continuar rodando até que o usuário decida encerrar.
import time
print("===================================")
print("Bem-vindo ao Sistema de Elevador!")
print("===================================")

while True:
    andar_atual = int(input("Digite o andar onde você está (0-10): "))
    if andar_atual < 0 or andar_atual > 10:
        print("Andar inválido. Por favor, digite um número entre 0 e 10.")
        continue

    print(f"Andar atual: {andar_atual}")
    pessoas_no_elevador = int(input("Digite o número de pessoas no elevador (0-5): "))
    if pessoas_no_elevador < 0 or pessoas_no_elevador > 5:
        print("Número de pessoas inválido. Por favor, digite um número entre 0 e 5.")
        continue

    print(f"Pessoas no elevador: {pessoas_no_elevador}")
    andar_destino = int(input("Digite o andar de destino (0-10): "))
    if andar_destino < 0 or andar_destino > 10:
        print("Andar de destino inválido. Por favor, digite um número entre 0 e 10.")
        continue
    
    print(f"Andar de destino: {andar_destino}")
    if andar_destino > andar_atual:
        for i in range(andar_atual + 1, andar_destino + 1):
                print(f"Andar {i} Subindo...")
                time.sleep(1)
    elif andar_destino < andar_atual:
        for i in range(andar_atual - 1, andar_destino - 1, -1):
                print(f" Andar {i} Descendo...")
                time.sleep(1)
    else:
        print("Você já está no andar de destino.")
    print(f"Chegamos ao andar {andar_destino}.")
    encerrar = input("Deseja sair do elevador? (s/n): ")
    if encerrar == "s":
        print("Encerrando o programa. Obrigado por usar o Sistema de Elevador!")
        break
    else:
        continue