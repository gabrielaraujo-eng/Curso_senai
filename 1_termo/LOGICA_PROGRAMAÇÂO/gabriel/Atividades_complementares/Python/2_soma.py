# Digite dois números e mostre a soma.
# n1 = int(input("numero 1:"))
# n2 = int(input("numero 2:"))
# s = n1 + n2
# print(f"a soma dos numeros é {s}")

import tkinter as tk
from tkinter import messagebox

janela = tk.Tk()
janela.title("Soma de numeros")
janela.geometry("300x300")

def soma():
    n1 = int(entry_numero1.get())
    n2 = int(entry_numero2.get())

    soma = n1+n2
    messagebox.showinfo("Soma dos numeros",f"A soma dos numeros é {soma}.")

lbl_titulo = tk.Label(janela, text="Soma de números")
lbl_titulo.grid(row=0,column=0,padx=10,pady=10)

entry_numero1 = tk.Entry(janela)
entry_numero1.grid(row=1,column=0,padx=10,pady=10)

entry_numero2 = tk.Entry(janela)
entry_numero2.grid(row=2, column=0,padx=10,pady=10)

btn_enviar = tk.Button(janela, text="Enviar", command=soma)
btn_enviar.grid(row=3,column=0,padx=10,pady=10)

janela.mainloop()

