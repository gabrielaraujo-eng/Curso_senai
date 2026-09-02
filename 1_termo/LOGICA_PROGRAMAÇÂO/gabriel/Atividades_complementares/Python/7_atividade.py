import tkinter as tk

# 1. Janela
janela = tk.Tk()
janela.title("Sistema de Níveis")
janela.geometry("400x300")

# 2. Função
def calcular():
    pontos_iniciais = int(entry_iniciais.get())
    pontos_ganhos = int(entry_ganhos.get())

    soma_pontos = pontos_iniciais + pontos_ganhos

    if soma_pontos >= 60:
        nivel = 4
        texto = "Você está no nível 4 (PRO PLAYER)"
    elif soma_pontos >= 40:
        nivel = 3
        texto = "Você está no nível 3"
    elif soma_pontos >= 20:
        nivel = 2
        texto = "Você está no nível 2"
    else:
        nivel = 1
        texto = "Você está no nível 1"

    lbl_resultado.config(text=f"Pontos: {soma_pontos} | {texto}")

# 3. Inputs
tk.Label(janela, text="Pontos iniciais").pack()
entry_iniciais = tk.Entry(janela)
entry_iniciais.pack()

tk.Label(janela, text="Pontos ganhos").pack()
entry_ganhos = tk.Entry(janela)
entry_ganhos.pack()

# 4. Botão
tk.Button(janela, text="Calcular", command=calcular).pack()

# 5. Resultado
lbl_resultado = tk.Label(janela, text="")
lbl_resultado.pack()

# 6. Rodar
janela.mainloop()
