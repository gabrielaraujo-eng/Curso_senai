# Interface Gráfica com TKINTER
# Componentes Principais (Widgets)

# tk: Janela principal
# Label: Texto ou rotulo
# Button: Um botão clicável 
# Entry: Um campo de entrada de texto

import tkinter as tk
from tkinter import messagebox

# 1. Criar a janela principal
janela = tk.Tk()
janela.title("Minha Primeira Janela GUI")
janela.geometry("400x200") #Largura x Altura

# 2. Criar a função que o botão irá executar
def mostrar_mensagem():
    messagebox.showinfo("Sucesso!", "Você clicou no botão :)")
    pergunta = messagebox.askyesno("Pergunta", "Deseja continuar?")
    if pergunta:
        messagebox.showinfo("Continuar", "Você escolheu continuar!")
    else:
        messagebox.showinfo("Parar", "Você escolheu parar!")

def mostrar_mensagem2():
    messagebox.showwarning("Aviso!", "Não era para clicar nesse botão!")

    messagebox.showwarning("o mundo ira explodir agora!", "Cuidado com o que clica!")

# 3. Criar os componentes
lbl_titulo_pagina = tk.Label(janela, text="Bem-Vindo a aula de Interface Gráfica!", font=("Arial", 14, "bold"))
btn_clique_pagina = tk.Button(janela, text="Clique Aqui", font=("Arial", 14), bg="#2ecc71", fg="white", command=mostrar_mensagem)
btn_fechar_janela = tk.Button(janela, text="Fechar", font=("Arial", 14), bg="#e74c3c", fg="white", command=janela.destroy)
btn_nao_clique = tk.Button(janela, text="Nao clique aqui", font=("Arial", 14), bg="#ececec", fg="white", command=mostrar_mensagem2)
# 4. Posicionar os componentes na janela
lbl_titulo_pagina.pack(pady=20) #pady adiciona um espaçamento verticial
btn_clique_pagina.pack(pady=15)
btn_fechar_janela.pack(pady=10)
btn_nao_clique.pack(pady=1)

# 5. Rodar o loop da interface
janela.mainloop()
