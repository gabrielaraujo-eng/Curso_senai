# Perfil de Gamer
print("=== Perfil de Gamer ===")

nick = input("Digite o nick do jogador: ")
nivel = input("Digite o nível do jogador: ")

print(f"O jogador {nick} está no nível {nivel} e pronto para a partida!")

# Calculadora de Mesada
print("\n=== Calculadora de Mesada ===")

valor_semanal = float(input("Digite o valor da mesada semanal: "))
valor_mensal = valor_semanal * 4

print(f"No final do mês, você terá R$ {valor_mensal:.2f}")
