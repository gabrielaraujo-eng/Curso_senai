# 1. Registro de Operador: Peça o nome do operador e o turno (A, B ou C). Exiba:
# "Operador [Nome] registrado no Turno [Turno]. Boa jornada!"

# import tkinter as tk 
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Registro de Operador")
# janela.geometry("400x400")
# janela.configure(bg="#1e2938")

# #def
# def registro():
#     nome = ent_nome.get()
#     turno = ent_turno.get()
#     messagebox.showinfo("Registro", f"Operador {nome} registrado no Turno {turno}. Boa jornada!")

# #componentes
# lbl_titulo = tk.Label(janela, text="Registro de Operador", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_nome = tk.Label(janela, text="Nome do Operador:", bg="#1e2938", fg="#ffffff")
# ent_nome = tk.Entry(janela)
# lbl_turno = tk.Label(janela, text="Turno (A, B ou C):", bg="#1e2938", fg="#ffffff")
# ent_turno = tk.Entry(janela)
# btn_registrar = tk.Button(janela, text="Registrar", command=registro)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_nome.grid(row=1, column=0, padx=10, pady=5)
# ent_nome.grid(row=2, column=0, padx=10, pady=5)
# lbl_turno.grid(row=3, column=0, padx=10, pady=5)
# ent_turno.grid(row=4, column=0, padx=10, pady=5)
# btn_registrar.grid(row=5, column=0, padx=10, pady=10)
# btn_fechar.grid(row=6, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 2. Cálculo de Produção: Peça a quantidade de peças produzidas em 1 hora. Calcule e
# exiba quantas peças serão produzidas em um turno de 8 horas.

# import tkinter as tk
# from tkinter import messagebox

# #janela
# janela = tk.Tk()
# janela.title("Cauculo de produção")
# janela.geometry("400x400")
# janela.configure(bg="#1e2938")

# #def
# def cauculo():
#     quantidade = int(ent_quantidade.get())
#     resultado = quantidade * 8
#     messagebox.showinfo("Resultado",f"serão produzidas em um turno de 8 horas {resultado} peças")

# #componentes
# lbl_titulo = tk.Label(janela, text="Cauculo de produção", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_quantidade = tk.Label(janela, text="Quantidade de peças produzidas em 1 hora:", bg="#1e2938", fg="#ffffff")
# ent_quantidade = tk.Entry(janela)
# btn_cauculo = tk.Button(janela, text="Caucular", command=cauculo)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_quantidade.grid(row=1, column=0, padx=10, pady=5)
# ent_quantidade.grid(row=2, column=0, padx=10, pady=5)
# btn_cauculo.grid(row=3, column=0, padx=10, pady=10)
# btn_fechar.grid(row=4, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()
            
# 3. Conversor de Unidade: O sistema lê uma pressão em Bar. Converta para PSI (1 Bar
# ≈ 14.5 PSI) e exiba com duas casas decimais.

# import tkinter as tk
# from tkinter import messagebox

# #janela
# janela = tk.Tk()
# janela.title("Conversor de Unidade")
# janela.geometry("400x400")
# janela.configure(bg= "#1e2938")

# #def
# def converter():
#     bar = float(ent_bar.get())
#     psi = bar * 14.5
#     messagebox.showinfo("Resultado", f"{bar} Bar é equivalente a {psi:.2f} PSI")

# #componentes
# lbl_titulo = tk.Label(janela, text="Conversor de Unidade", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_bar = tk.Label(janela, text="Pressão em Bar:", bg="#1e2938", fg="#ffffff")
# ent_bar = tk.Entry(janela)
# btn_converter = tk.Button(janela, text="Converter", command=converter)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_bar.grid(row=1, column=0, padx=10, pady=5)
# ent_bar.grid(row=2, column=0, padx=10, pady=5)
# btn_converter.grid(row=3, column=0, padx=10, pady=10)
# btn_fechar.grid(row=4, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 4. Média de Qualidade: Peça 3 notas de inspeção de uma peça (0 a 10). Exiba a média
# aritmética simples delas.

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Média de Qualidade")
# janela.geometry("300x400")
# janela.configure(bg= "#1e2938")

#def
# def media():
#     peca1 = int(ent_peca.get())
#     peca2 = int(ent_peca2.get())
#     peca3 = int(ent_peca3.get())

#     media = (peca1 + peca2 + peca3) / 3
#     messagebox.showinfo("Resultado", f"A média de qualidade da peça é: {media:.2f}")

# #componentes
# lbl_titulo = tk.Label(janela, text="Média de Qualidade", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_peca = tk.Label(janela, text="Nota da peça 1 (0 a 10):", bg="#1e2938", fg="#ffffff")
# ent_peca = tk.Entry(janela)
# lbl_peca2 = tk.Label(janela, text="Nota da peça 2 (0 a 10):", bg="#1e2938", fg="#ffffff")
# ent_peca2 = tk.Entry(janela)
# lbl_peca3 = tk.Label(janela, text="Nota da peça 3 (0 a 10):", bg="#1e2938", fg="#ffffff")
# ent_peca3 = tk.Entry(janela)
# btn_calcular = tk.Button(janela, text="Calcular Média", command=media)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_peca.grid(row=1, column=0, padx=10, pady=10)
# ent_peca.grid(row=2, column=0, padx=10, pady=10)
# lbl_peca2.grid(row=3, column=0, padx=10, pady=10)
# ent_peca2.grid(row=4, column=0, padx=10, pady=10)
# lbl_peca3.grid(row=5, column=0, padx=10, pady=10)
# ent_peca3.grid(row=6, column=0, padx=10, pady=10)
# btn_calcular.grid(row=7, column=0, padx=10, pady=10)
# btn_fechar.grid(row=8, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

#5. Termostato Inteligente: Peça a temperatura de um motor.
# ● Abaixo de 40°C: "Baixa carga".
# ● Entre 40°C e 70°C: "Normal".
# ● Acima de 70°C: "ALERTA: Resfriamento Ativado!".

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Termostato Inteligente")
# janela.geometry("300x300")
# janela.configure(bg= "#1e2938")

# #def
# def verificar():
#     temperatura = float(ent_temperatura.get())

#     if temperatura < 40:
#         messagebox.showinfo("Resultado", "Baixa carga")
#     elif 40 <= temperatura <= 70:
#         messagebox.showinfo("Resultado", "Normal")
#     else:
#         messagebox.showinfo("Resultado", "ALERTA: Resfriamento Ativado!")

# #componentes
# lbl_titulo = tk.Label(janela, text="Termostato Inteligente", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_temperatura = tk.Label(janela, text="Temperatura do motor (°C):", bg="#1e2938", fg="#ffffff")
# ent_temperatura = tk.Entry(janela)
# btn_verificar = tk.Button(janela, text="Verificar", command=verificar)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_temperatura.grid(row=1, column=0, padx=10, pady=10)
# ent_temperatura.grid(row=2, column=0, padx=10, pady=10)
# btn_verificar.grid(row=3, column=0, padx=10, pady=10)
# btn_fechar.grid(row=4, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 6. Classificador de Lotes: O usuário insere o código do produto. Se começar com "A",
# exiba "Alimentos". Se "E", "Eletrônicos". Para qualquer outro, "Desconhecido".

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Classificador de Lotes")
# janela.geometry("300x300")
# janela.configure(bg= "#1e2938")

# #def
# def classificar():
#     codigo = ent_codigo.get()

#     if codigo == "A":
#         messagebox.showinfo("Resultado", "Alimentos")
#     elif codigo == "E":
#         messagebox.showinfo("Resultado", "Eletrônicos")
#     else:
#         messagebox.showinfo("Resultado", "Desconecido")

# #componentes
# lbl_titulo = tk.Label(janela, text="Classificador de Lotes", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_informacao = tk.Label(janela, text="Coloque em Maiúsculo",font=("Arial", 8), bg="#1e2938", fg="#ffffff")
# lbl_codigo = tk.Label(janela, text="Código do produto: ",font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_codigo = tk.Entry(janela)
# btn_classificar = tk.Button(janela, text="Classificar", command=classificar)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_informacao.grid(row=1, column=0, padx=10, pady=10)
# lbl_codigo.grid(row=2, column=0, padx=10, pady=10)
# ent_codigo.grid(row=3, column=0, padx=10, pady=10)
# btn_classificar.grid(row=4, column=0, padx=10, pady=10)
# btn_fechar.grid(row=5, column=0, padx=10, pady=10)
# #loop da janela
# janela.mainloop()

# 7. Segurança de Operação: A máquina só liga se o sensor_porta == "fechada" E o
# botao_emergencia == "desligado". Peça esses dois inputs e diga se a máquina pode
# iniciar.

# import tkinter as tk
# from tkinter import messagebox, ttk

# # janela
# janela = tk.Tk()
# janela.title("Segurança de Operação")
# janela.geometry("300x300")
# janela.configure(bg="#1e2938")

# #def 
# def verificar():
#     sensor_porta = combo_porta.get()
#     botao_emergencia = combo_emergencia.get()

#     if sensor_porta == "fechada" and botao_emergencia == "desligado":
#         messagebox.showinfo("Resultado", "A máquina pode iniciar.")
#     else:
#         messagebox.showinfo("Resultado", "A máquina não pode iniciar. Verifique os sensores.")

# #componentes
# lbl_titulo = tk.Label(janela, text="Segurança de Operação", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_porta = tk.Label(janela, text="Sensor da Porta:", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# combo_porta = ttk.Combobox(janela, values=["fechada", "aberta"])
# lbl_emergencia = tk.Label(janela, text="Botão de Emergência:", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# combo_emergencia = ttk.Combobox(janela, values=["desligado", "ligado"])
# btn_verificar = tk.Button(janela, text="Verificar", command=verificar)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_porta.grid(row=1, column=0, padx=10, pady=5)
# combo_porta.grid(row=2, column=0, padx=10, pady=5)
# lbl_emergencia.grid(row=3, column=0, padx=10, pady=5)
# combo_emergencia.grid(row=4, column=0, padx=10, pady=5)
# btn_verificar.grid(row=5, column=0, padx=10, pady=10)
# btn_fechar.grid(row=6, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 8. Cálculo de Descarte: Peça o total de peças produzidas e o total de defeituosas. Se
# o descarte for maior que 5% do total, exiba "Revisar Processo", caso contrário,
# "Processo Otimizado".

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Cálculo de Descarte")
# janela.geometry("300x300")
# janela.configure(bg= "#1e2938")

# #def
# def calcular_descarte():
#     total_produzidas = float(ent_total.get())
#     total_defeituosas = float(ent_defeituosas.get())

#     taxa_descarte = (total_defeituosas / total_produzidas) * 100

#     if taxa_descarte > 5:
#         messagebox.showinfo("Resultado", f"Taxa de descarte: {taxa_descarte:.2f}%. Revisar Processo.")
#     else:
#         messagebox.showinfo("Resultado", f"Taxa de descarte: {taxa_descarte:.2f}%. Processo Otimizado.")

# #componentes
# lbl_titulo = tk.Label(janela, text="Cálculo de Descarte", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_total = tk.Label(janela, text="Total de Peças Produzidas:", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_total = tk.Entry(janela)
# lbl_defeituosas = tk.Label(janela, text="Total de Peças Defeituosas:", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_defeituosas = tk.Entry(janela)
# btn_calcular = tk.Button(janela, text="Calcular Descarte", command=calcular_descarte)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_total.grid(row=1, column=0, padx=10, pady=5)
# ent_total.grid(row=2, column=0, padx=10, pady=5)
# lbl_defeituosas.grid(row=3, column=0, padx=10, pady=5)
# ent_defeituosas.grid(row=4, column=0, padx=10, pady=5)
# btn_calcular.grid(row=5, column=0, padx=10, pady=10)


# #loop da janela
# janela.mainloop()

# 9. Validação de Medida: Uma peça deve ter entre 9.8mm e 10.2mm. Peça a medida e
# diga se está dentro da tolerância, acima ou abaixo.

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Validação de Medida")
# janela.geometry("300x200")
# janela.configure(bg="#1e2938")

# #def
# def validar():
#     medida = float(ent_medida.get())

#     if 9.8 <= medida <= 10.2:
#         messagebox.showinfo("Resultado", "A medida está dentro da tolerância.")
#     elif medida < 9.8:
#         messagebox.showinfo("Resultado", "A medida está abaixo da tolerância.")
#     else:
#         messagebox.showinfo("Resultado", "A medida está acima da tolerância.")

# #componentes
# lbl_titulo = tk.Label(janela, text="Validação de Medida", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_medida = tk.Label(janela, text="Medida da peça (mm):", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# lbl_informacao = tk.Label(janela, text="A peça deve ter entre 9.8mm e 10.2mm", font=("Arial", 8), bg="#1e2938", fg="#ffffff")
# ent_medida = tk.Entry(janela)  
# btn_validar = tk.Button(janela, text="Validar", command=validar)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes 
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_medida.grid(row=1, column=0, padx=10, pady=5)
# ent_medida.grid(row=2, column=0, padx=10, pady=5)
# btn_validar.grid(row=3, column=0, padx=10, pady=10)
# lbl_informacao.grid(row=4, column=0, padx=10, pady=5)
# btn_fechar.grid(row=5, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 10.Contagem Regressiva de Setup: Use um for para fazer uma contagem regressiva
# de 10 até 1 para o início de uma prensa, e finalize com "Prensa Ativada!".

# import tkinter as tk
# from tkinter import messagebox

# #janela
# janela = tk.Tk()
# janela.title("Contagem Regressiva de Setup")
# janela.geometry("300x200")
# janela.configure(bg="#1e2938")

# #def
# def contagem():
#     for i in range(1, 11):
#         messagebox.showinfo("Contagem Regressiva", f"Contagem: {11 - i}")
#     messagebox.showinfo("Atenção", "Prensa Ativada!")

# #componentes
# lbl_titulo = tk.Label(janela, text="Contagem da prensa", font=("Arial",14), bg="#1e2938", fg="#ffffff")
# btn_iniciar = tk.Button(janela, text="Iniciar Contagem", command=contagem)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local de componentes
# lbl_titulo.grid(row=0,column=0,padx=10,pady=10)
# btn_iniciar.grid(row=1,column=0,padx=10,pady=10)
# btn_fechar.grid(row=2,column=0,padx=10,pady=10)

# #loop da janela
# janela.mainloop()

# 11.Soma de Produção (Acumulador): Use um while para pedir o peso de várias caixas.
# O loop para quando o usuário digitar 0. No fim, mostre o peso total acumulado.

# import tkinter as tk
# from tkinter import messagebox

# #janela
# janela = tk.Tk()
# janela.title("Soma de Produção")
# janela.geometry("400x400")
# janela.configure(bg="#1e2938")

# total = 0

# #def
# def somar():
#     global total
#     while True:
#         peso = float(ent_peso.get())
#         if peso == 0:
#             break
#         total += peso
#         lbl_peso_atual.config(text=f"Peso acumulado: {total:.2f} kg")
#         ent_peso.delete(0, tk.END)
#     messagebox.showinfo("Resultado", f"O peso total acumulado é: {total:.2f} kg")

# #componentes
# lbl_titulo = tk.Label(janela, text="Soma de Produção", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_peso = tk.Label(janela, text="Peso da caixa (kg):", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_peso = tk.Entry(janela)
# btn_somar = tk.Button(janela, text="Somar", command=somar)
# lbl_peso_atual = tk.Label(janela, text=f"Peso acumulado: {total:.2f} kg", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_peso.grid(row=1, column=0, padx=10, pady=5)
# ent_peso.grid(row=2, column=0, padx=10, pady=5)
# btn_somar.grid(row=3, column=0, padx=10, pady=10)
# lbl_peso_atual.grid(row=4, column=0, padx=10, pady=5)
# btn_fechar.grid(row=5, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 12.Múltiplas Leituras: Use um for para pedir a temperatura de 5 sensores diferentes.
# Ao final, mostre qual foi a maior temperatura lida.

# import tkinter as tk
# from tkinter import messagebox

# #janela
# janela = tk.Tk()
# janela.title("Múltiplas Leituras")
# janela.geometry("400x400")
# janela.configure(bg="#1e2938")

# #def
# def maior_temperatura():
#     temperatura_1= float(ent_temperatura1.get())
#     temperatura_2= float(ent_temperatura2.get())
#     temperatura_3= float(ent_temperatura3.get())
#     temperatura_4= float(ent_temperatura4.get())
#     temperatura_5= float(ent_temperatura5.get())
#     temperaturas = [temperatura_1, temperatura_2, temperatura_3, temperatura_4, temperatura_5]

#     maior_temp = max(temperaturas)
#     messagebox.showinfo("Resultado", f"A maior temperatura lida é: {maior_temp:.2f} °C")


# #componentes
# lbl_titulo = tk.Label(janela, text="Múltiplas Leituras", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_informacao = tk.Label(janela, text="Digite a temperatura de 5 sensores diferentes", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_temperatura1 = tk.Entry(janela)
# ent_temperatura2 = tk.Entry(janela)
# ent_temperatura3 = tk.Entry(janela)
# ent_temperatura4 = tk.Entry(janela)
# ent_temperatura5 = tk.Entry(janela)
# btn_calcular = tk.Button(janela, text="Calcular Maior Temperatura", command=maior_temperatura)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_informacao.grid(row=1, column=0, padx=10, pady=10)
# ent_temperatura1.grid(row=2, column=0, padx=10, pady=5)
# ent_temperatura2.grid(row=3, column=0, padx=10, pady=5)
# ent_temperatura3.grid(row=4, column=0, padx=10, pady=5)
# ent_temperatura4.grid(row=5, column=0, padx=10, pady=5)
# ent_temperatura5.grid(row=6, column=0, padx=10, pady=5)
# btn_calcular.grid(row=7, column=0, padx=10, pady=10)
# btn_fechar.grid(row=8, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 13.Painel de Login: Crie um while que peça a senha do supervisor ("admin123").
# Enquanto ele errar, o programa diz "Acesso Negado". Ele tem apenas 3 tentativas.
# Se esgotar, exiba "Painel Bloqueado".

# import tkinter as tk
# from tkinter import messagebox
# import time

# #janela
# janela = tk.Tk()
# janela.title("Painel de Login")
# janela.geometry("300x300")
# janela.configure(bg="#1e2938")

# #def
# def verificar_senha():
#     tentativas = 0
#     while tentativas < 3:
#         senha = ent_senha.get()
#         if senha == "admin123":
#             messagebox.showinfo("Acesso Permitido", "Bem-vindo, Supervisor!")
#             break
#         elif senha != ent_senha.get():
#             messagebox.showerror("Acesso Negado", "Senha incorreta. Tente novamente.")
#             tentativas += 1
#             break
#         else:
#             messagebox.showerror("Painel Bloqueado", "Número máximo de tentativas esgotado.")
#             break

# #componentes
# lbl_titulo = tk.Label(janela, text="Painel de Login", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_informacao = tk.Label(janela, text="Digite a senha do supervisor:", font=("Arial", 12), bg="#1e2938", fg="#ffffff")
# ent_senha = tk.Entry(janela)
# btn_verificar = tk.Button(janela, text="Verificar", command=verificar_senha)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_informacao.grid(row=1, column=0, padx=10, pady=10)
# ent_senha.grid(row=2, column=0, padx=10, pady=5)
# btn_verificar.grid(row=3, column=0, padx=10, pady=10)
# btn_fechar.grid(row=4, column=0, padx=10, pady=10)

# #loop da janela
# janela.mainloop()

# 14.Simulador de Estoque: Comece com estoque = 100. Crie um menu (while) onde o
# usuário pode: (1) Adicionar itens, (2) Remover itens ou (3) Sair. Se o estoque ficar
# abaixo de 10, avise: "Estoque Crítico!".

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Simulador de Estoque")
# janela.geometry("700x400")
# janela.configure(bg="#1e2938")

# #def
# estoque = 100
# def adicionar():
#     global estoque
#     while True:
#         if ent_adicionar.get() == "1":
#             quantidade = int(ent_quantidade.get())
#             estoque += quantidade
#             lbl_estoque.config(text=f"Estoque Atual: {estoque}")
#             break
#         elif ent_adicionar.get() == "2":
#             quantidade = int(ent_quantidade.get())
#             estoque -= quantidade
#             lbl_estoque.config(text=f"Estoque Atual: {estoque}")
#             break
#         elif ent_adicionar.get() == "3":
#             messagebox.showinfo("Sair", "Encerrando o simulador de estoque.")
#             break
#         if estoque <= 10:
#             messagebox.showwarning("Atenção", "Estoque critico")
#             break
#         else:
#             messagebox.showinfo("Atenção","Digite uma opção")
#             break

# #componentes
# lbl_titulo = tk.Label(janela, text="Simulador de Estoque", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# lbl_estoque = tk.Label(janela, text="Estoque atual: 100",font=("Arial", 14), bg="#1e2938", fg="#ffffff")
# ent_quantidade = tk.Entry(janela)
# lbl_informa = tk.Label(janela, text="Coloque o valor que deseja abaixo",font=("Arial", 14), bg="#1e2938", fg="#ffffff")
# lbl_escolha = tk.Label(janela, text="Escolha (1) Adicionar itens, (2) Remover itens ou (3) Sair.", font=("Arial", 16), bg="#1e2938", fg="#ffffff")
# ent_adicionar = tk.Entry(janela)
# btn_adicionar = tk.Button(janela,text="Enviar",command=adicionar)
# btn_fechar = tk.Button(janela, text="Fechar", command=janela.destroy, bg="#ff0000", fg="#ffffff")

# #local dos componentes
# lbl_titulo.grid(row=0,column=0,padx=10,pady=10)
# lbl_estoque.grid(row=1,column=0,padx=10,pady=10)
# lbl_informa.grid(row=2,column=0,padx=10,pady=10)
# ent_quantidade.grid(row=3,column=0,padx=10,pady=10)
# lbl_escolha.grid(row=4,column=0,padx=10,pady=10)
# ent_adicionar.grid(row=5,column=0,padx=10,pady=10)
# btn_adicionar.grid(row=6,column=0,padx=10,pady=10)
# btn_fechar.grid(row=7,column=0,padx=10,pady=10)

# #loop da janela
# janela.mainloop()

# 15.Relatório de Turno Completo: Use um for para processar 5 peças. Para cada peça,
# peça o diâmetro. Se a peça for aprovada (entre 19.9 e 20.1), conte-a. No final do
# loop, exiba o total de peças aprovadas e a porcentagem de eficiência do lote.

# import tkinter as tk
# from tkinter import messagebox

# # janela
# janela = tk.Tk()
# janela.title("Relatório de Turno")
# janela.geometry("700x400")
# janela.configure(bg="#1e2938")

# # variáveis
# peca_atual = 1
# aprovadas = 0
# total_pecas = 5

# # função
# def verificar():
#     global peca_atual, aprovadas
#     diametro = float(ent_diametro.get())
#     if 19.9 <= diametro <= 20.1:
#         aprovadas += 1

#     peca_atual += 1
#     ent_diametro.delete(0, tk.END)

#     if peca_atual <= total_pecas:
#         lbl_instrucao.config(text=f"Digite o diâmetro da peça {peca_atual}:")
#     else:
#         eficiencia = (aprovadas / total_pecas) * 100
#         messagebox.showinfo("Relatório Final",f"Peças aprovadas: {aprovadas} e a eficiência do lote: {eficiencia:.2f}%")

# # componentes
# lbl_titulo = tk.Label(janela,text="Relatório de Turno Completo",font=("Arial", 16),bg="#1e2938",fg="#ffffff")
# lbl_instrucao = tk.Label(janela,text="Digite o diâmetro da peça 1:",font=("Arial", 14),bg="#1e2938",fg="#ffffff")
# ent_diametro = tk.Entry(janela)
# btn_enviar = tk.Button(janela,text="Enviar",command=verificar)
# btn_fechar = tk.Button(janela,text="Fechar",command=janela.destroy,bg="#ff0000",fg="#ffffff")

# # posicionamento
# lbl_titulo.grid(row=0, column=0, padx=10, pady=10)
# lbl_instrucao.grid(row=1, column=0, padx=10, pady=10)
# ent_diametro.grid(row=2, column=0, padx=10, pady=10)
# btn_enviar.grid(row=3, column=0, padx=10, pady=10)
# btn_fechar.grid(row=4, column=0, padx=10, pady=10)

# # loop da janela
# janela.mainloop()