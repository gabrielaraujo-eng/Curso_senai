import random

# Configurações
LINHAS = 5
COLUNAS = 5
MINAS = 5

# Criar tabuleiro vazio
def criar_tabuleiro():
    return [[" " for _ in range(COLUNAS)] for _ in range(LINHAS)]

# Colocar minas aleatórias
def colocar_minas(tabuleiro):
    minas_colocadas = 0
    while minas_colocadas < MINAS:
        l = random.randint(0, LINHAS - 1)
        c = random.randint(0, COLUNAS - 1)
        if tabuleiro[l][c] != "M":
            tabuleiro[l][c] = "M"
            minas_colocadas += 1

# Contar minas ao redor
def contar_minas(tabuleiro, l, c):
    count = 0
    for i in range(l - 1, l + 2):
        for j in range(c - 1, c + 2):
            if 0 <= i < LINHAS and 0 <= j < COLUNAS:
                if tabuleiro[i][j] == "M":
                    count += 1
    return count

# Mostrar tabuleiro do jogador
def mostrar(tabuleiro_visivel):
    print("\nTabuleiro:")
    for linha in tabuleiro_visivel:
        print(" ".join(linha))

# Jogo principal
def jogar():
    tabuleiro = criar_tabuleiro()
    visivel = criar_tabuleiro()
    colocar_minas(tabuleiro)

    while True:
        mostrar(visivel)
        try:
            l = int(input("Linha (0-4): "))
            c = int(input("Coluna (0-4): "))
        except:
            print("Entrada inválida!")
            continue

        if tabuleiro[l][c] == "M":
            print("💥 BOOM! Você perdeu!")
            mostrar(tabuleiro)
            break
        else:
            minas = contar_minas(tabuleiro, l, c)
            visivel[l][c] = str(minas)

            # Checar vitória
            ganhou = True
            for i in range(LINHAS):
                for j in range(COLUNAS):
                    if visivel[i][j] == " " and tabuleiro[i][j] != "M":
                        ganhou = False

            if ganhou:
                print("🎉 Você venceu!")
                mostrar(tabuleiro)
                break

# Executar
jogar()
