# 0. Importar bibliotecas
import tkinter as tk
from tkinter import messagebox

# Variáveis do jogo
pontos = 0
por_clique = 1
custo_upgrade = 10
bg = "#1e2938"

# 1. Criar janela
janela = tk.Tk()
janela.title("Jogo Clicker")
janela.geometry("500x400")
janela.configure(bg=bg)

# 2. Criar funções
def abrir_segunda_janela():
    global btn_upgrade, janela_loja

    janela_loja = tk.Toplevel(janela)
    janela_loja.title("LOJA")
    janela_loja.geometry("400x300")
    janela_loja.configure(bg=bg)

    btn_upgrade = tk.Button(janela_loja, text=f"Custo: {custo_upgrade}", font=("Arial", 12), bg="gold", fg="black", command=comprar_upgrade)
    btn_upgrade.pack(padx=10, pady=10)

def clicar():
    global pontos
    pontos += por_clique
    lbl_pontos.config(text=f"Pontos: {pontos}")

def comprar_upgrade():
    global pontos, por_clique, custo_upgrade

    if pontos >= custo_upgrade:
        pontos -= custo_upgrade
        por_clique += 1
        custo_upgrade += 10

        lbl_pontos.config(text=f"Pontos: {pontos}")
        lbl_clique.config(text=f"Pontos por clique: {por_clique}")

        if 'btn_upgrade' in globals():
            btn_upgrade.config(text=f"Custo: {custo_upgrade}")
    else:
        messagebox.showwarning("Sem pontos", "Você não tem pontos suficientes!")

def resetar():
    global pontos, por_clique, custo_upgrade

    pontos = 0
    por_clique = 1
    custo_upgrade = 10

    lbl_pontos.config(text=f"Pontos: {pontos}")
    lbl_clique.config(text=f"Pontos por clique: {por_clique}")

    if 'btn_upgrade' in globals():
        btn_upgrade.config(text=f"Custo: {custo_upgrade}")

# 3. Criar componentes
lbl_titulo = tk.Label(janela, text=" JOGO CLICKER", font=("Arial", 18, "bold"), bg=bg, fg="white")
lbl_pontos = tk.Label(janela, text="Pontos: 0", font=("Arial", 16), bg=bg, fg="white")
lbl_clique = tk.Label(janela, text="Pontos por clique: 1", font=("Arial", 14), bg=bg, fg="white")

btn_click = tk.Button(janela, text="fonte de pontos", font=("Arial", 12, "bold"), bg="#00ff22", fg="black", command=clicar)
btn_loja = tk.Button(janela, text="Loja", font=("Arial", 12), bg="gold", fg="black", command=abrir_segunda_janela)
btn_reset = tk.Button(janela, text="Resetar", font=("Arial", 12), bg="#a73131", fg="white", command=resetar)
btn_fechar = tk.Button(janela, text="Nao clique", font=("Arial", 12), bg="red", fg="white", command=janela.destroy)

# 4. Posicionar componentes
lbl_titulo.pack(padx=10, pady=10)
lbl_pontos.pack(padx=10, pady=10)
lbl_clique.pack(padx=10, pady=10)

btn_click.pack(padx=10, pady=10)
btn_loja.pack(padx=10, pady=10)
btn_reset.pack(padx=10, pady=10)
btn_fechar.pack(padx=10, pady=10)

# 5. Rodar interface
janela.mainloop()
