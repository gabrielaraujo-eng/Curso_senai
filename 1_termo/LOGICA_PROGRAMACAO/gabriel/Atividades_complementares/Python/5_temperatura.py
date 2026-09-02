# Crie um programa em Tkinter que receba uma temperatura em graus Celsius e classifique:

# Regras:
# Se a temperatura for maior ou igual a 30°C → mostrar: “Muito quente”
# Se a temperatura estiver entre 20°C e 29°C → mostrar: “Agradável”
# Se a temperatura estiver entre 10°C e 19°C → mostrar: “Frio”
# Se for menor que 10°C → mostrar: “Muito frio”
# print("Transformação celcius em palavra")
# temperatura = float(input("Qual temperatura atual?: "))
# if temperatura >= 30:
#     print("Muito quente")
# elif 20 <= temperatura <= 29:
#     print("Agradavel")
# elif 10 <= temperatura <= 19:
#     print("Frio")
# else:
#     print("Muito frio")

import tkinter as tk
from tkinter import messagebox

janela = tk.Tk()
janela.title("Graus")
janela.geometry("400x400")

def tranformacao():
    temperatura = float(ent_grau.get())

    if temperatura >= 30:
        messagebox.showwarning("Atenção","Muito quente")
    elif 20 <= temperatura <= 29:
        messagebox.showinfo("Atenção","Agradavel")
    elif 10 <= temperatura <= 19:
        messagebox.showinfo("Atenção","Frio")
    else:
        messagebox.showwarning("Atenção","Muito frio")

lbl_titulo = tk.Label(janela, text="Classifica temperatura atual")
ent_grau = tk.Entry(janela)
btn_enviar = tk.Button(janela, text="enviar",command=tranformacao)

lbl_titulo.grid(row=0,column=0,padx=0,pady=10)
ent_grau.grid(row=1,column=0,padx=0,pady=10)
btn_enviar.grid(row=2,column=0,padx=0,pady=10)

janela.mainloop()

