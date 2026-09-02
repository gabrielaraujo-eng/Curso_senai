# Digite um valor em bar e converta para psi.
# print("Converter Bar em Psi")
# bar = float(input("Quantos bar voce quer transformar?: "))
# psi = bar * 14.5
# print(f"Seu resultado em PSI é: {psi:.2f}") 

import tkinter as tk
from tkinter import messagebox

janela = tk.Tk()
janela.title("Convertor")
janela.geometry("400x400")

def converter():
    bar = float(ent_bar.get())
    psi = bar*14.5
    messagebox.showinfo("Resultado da conversão",f"Seu resultado é: {psi:.2f}")

lbl_title = tk.Label(janela,text="Convertor de BAR para PSI (1bar = 14.5psi)")
ent_bar = tk.Entry(janela)
btn_enviar = tk.Button(janela,text="enviar",command=converter)

lbl_title.grid(row=0,column=0,padx=10,pady=10)
ent_bar.grid(row=1,column=0,padx=10,pady=10)
btn_enviar.grid(row=2,column=0,padx=10,pady=10)

janela.mainloop()
