import tkinter as tk

# 1
janela = tk.Tk()
janela.geometry("300x300")
# 2 
def mudar():
    texto = ety_novo.get()
    lbl_oi.config(text=texto)

def voltar():
    texto_inicial = "Olá mundo"
    lbl_oi.config(text=texto_inicial)
    


#3
lbl_oi = tk.Label(janela, text="OLá mundo")
btn_mudar = tk.Button(janela, text= "Clique para mudar o texto", command=mudar)
btn_voltar = tk.Button(janela, text="Clique para voltar pro inicial", command=voltar)
ety_novo = tk.Entry(janela) 
btn_fechar = tk.Button(janela, text="THE WORD",bg="#ff0000",fg="#ffffff", command=janela.destroy)
#4
lbl_oi.grid(row=0, column=0, padx=10, pady=10)
btn_mudar.grid(row=2, column=0, padx=10, pady=10)
btn_voltar.grid(row=3, column=0, padx=10, pady=10)
btn_fechar.grid(row=4, column=0, padx=10, pady=10)
ety_novo.grid(row=1, column=0, padx=10, pady=10)

#5
janela.mainloop()
