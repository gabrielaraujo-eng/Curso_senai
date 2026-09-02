# Interface gráfica com Tkinter
# OS componentes principais (widgets)

# Tk: Janela principal
# Label: é o texto a digitar = print
# Button: botão clicável de evento 
# Entry: caiza de texto = input

# 0.
import tkinter as tk
from tkinter import messagebox

# 1. Criar janela 
janela = tk.Tk()
janela.title("Minha primeira janela em GUI")
janela.geometry("400x400")
janela.configure(bg = "#8f8df8")

# 2. Criar função do botão
def mostrar_mensagens():
    messagebox.showinfo("Nerd ","hehe")

# 3. Criar componentes
lbl_titulo_pagina = tk.Label(janela, text="bem vindo a aula de interface grafica em python", font=("Arial", 14,"bold"))
lbl_subtitulo_pagina = tk.Label(janela, text="clique no botao para ver a mensagem", font=("Arial", 12))
btn_clique_ativar = tk.Button(janela, text="Clique eu", font =("Arial", 14), bg="#00ff22", fg = "white", command = mostrar_mensagens)
btn_clique_fechar = tk.Button(janela, text="fechar o MUNDO", command =janela.destroy)

# 4. Posicionar os componentes na janela
lbl_titulo_pagina.grid(row=0, column=0, padx=10, pady=10)
btn_clique_ativar.grid(row=0, column=1, padx=10, pady=10)
btn_clique_fechar.grid(row=0, column=2, padx=10, pady=10)
lbl_subtitulo_pagina.grid(row=1, column=0, padx=10, pady=10) 
# lbl_titulo_pagina.pack(pady=20) #adiciona espaçamento
# btn_clique_ativar.pack(pady=7)
# btn_clique_fechar.pack(pady=7)


# 5. rodar interface
janela.mainloop()

