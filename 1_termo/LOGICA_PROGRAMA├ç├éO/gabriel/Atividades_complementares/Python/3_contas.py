# Digite dois números e mostre:
# Soma
# Subtração
# Multiplicação
# Divisão

# print("Digite dois numero e mostrarei a \n SOMA,SUBTRAÇÂO,MULTIPLICAÇAO E DIVISÃO deles.")
# n1 = int(input("Numero 1: "))
# n2 = int(input("Numero 2: "))
# soma = n1+n2
# subtracao = n1-n2
# multiplicacao = n1 * n2
# divisao = n1/n2
# print(f"O resultado é soma:{soma},subtracao:{subtracao},multiplicação:{multiplicacao:.2f},divisão:{divisao:.2f}")

import tkinter as tk
from tkinter import messagebox

janela = tk.Tk()
janela.title("Multiplias contas")
janela.geometry("300x300")

def operacoes():
    n1 = int(ent_numero1.get())
    n2 = int(ent_numero2.get())

    soma = n1+n2
    subtracao = n1-n2
    multiplicacao = n1*n2
    divisao = n1/n2

    messagebox.showinfo("Resultado",f"O resultado é soma:{soma},subtracao:{subtracao},multiplicação:{multiplicacao:.2f},divisão:{divisao:.2f}")

lbl_titulo = tk.Label(janela, text="Digite dois numero e mostrarei a SOMA,SUBTRAÇÂO,MULTIPLICAÇAO E DIVISÃO deles")
lbl_titulo.grid(row=0,column=0,padx=10,pady=10)

ent_numero1 = tk.Entry(janela)
ent_numero1.grid(row=1,column=0,padx=10,pady=10)

ent_numero2 = tk.Entry(janela)
ent_numero2.grid(row=2,column=0,padx=10,pady=10)

btn_enviar = tk.Button(janela,text="Enviar",command=operacoes)
btn_enviar.grid(row=3,column=0,padx=10,pady=10)

janela.mainloop()
