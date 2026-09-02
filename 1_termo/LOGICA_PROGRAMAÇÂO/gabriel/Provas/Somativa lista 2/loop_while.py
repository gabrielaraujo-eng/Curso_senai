tentativas = 0
while tentativas <= 4:
    senha = input("sua: ")
    if senha == "admin123":
        print("Acesso Permitido", "Bem-vindo, Supervisor!")
        break
    elif senha != input("sua: "):
        print("Acesso Negado", "Senha incorreta. Tente novamente.")
        tentativas += 1
    else:
        print("Painel Bloqueado", "Número máximo de tentativas esgotado.")
        break
