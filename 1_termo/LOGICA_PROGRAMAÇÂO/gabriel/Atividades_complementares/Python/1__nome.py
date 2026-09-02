# nome = input("Qual seu nome?: ")
# print(f"Seja bem vindo {nome}")

import tkinter as tk
from tkinter import messagebox

janela = tk.Tk()
janela.title("Usuario")
janela.geometry("200x200")

def nome():
    nome = entry_nome.get()
    messagebox.showinfo("Seja bem vindo",f"Olá {nome} seja bem vindo.")

lbl_nome = tk.Label(janela, text="QUAL SEU NOME?")
lbl_nome.grid(row=0,column=0,padx=10,pady=10)

entry_nome = tk.Entry(janela)
entry_nome.grid(row=1,column=0,padx=10,pady=10)

btn_nome = tk.Button(janela,text="Enviar", command=nome)
btn_nome.grid(row=2,column=0,padx=10,pady=10)

janela.mainloop()




