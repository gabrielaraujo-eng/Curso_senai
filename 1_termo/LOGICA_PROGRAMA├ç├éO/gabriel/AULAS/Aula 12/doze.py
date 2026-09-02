import tkinter as tk
from tkinter import messagebox, ttk

def bemvindo():
    # .get() serve para buscar o texto da caixa
    nome_usuario = usuario_nome.get()
    usuario_idade = idade_usuario.get()
    sexo_pessoa = pessoa_sexo.get()

    if nome_usuario == "" and usuario_idade == "" and sexo_pessoa == "":
        messagebox.showerror("!","por favor digite seu nome, idade e sexo :)")
    else:
        messagebox.showinfo("Bem vindo", f"Olá {nome_usuario} você tem {usuario_idade} anos você é do pais {combo_nivel.get()}, e seu sexo é {sexo_pessoa} :)")

def janela_segunda():
    segunda_janela = tk.Toplevel(janela_bemvindo)
    segunda_janela.title("Segunda Janela")
    segunda_janela.geometry("400x300")
    segunda_janela.configure(bg= "#696565")
    
    lbl_segunda_janela = tk.Label(segunda_janela, text="Bem Vindo a Segunda Janela")
    lbl_segunda_janela.grid(row=0, column=0, pady=10,padx=10)

#|janela
janela_bemvindo = tk.Tk()
janela_bemvindo.title("Saudações Do Usuario")
janela_bemvindo.geometry("600x300")
janela_bemvindo.configure(bg= "#696565")

# Componentes de ComboBox
combo_nivel = tk.ttk.Combobox(janela_bemvindo, values=["Brasil", "EUA", "Egito", "Itália", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda", "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão", "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Bélgica", "Belize", "Benim", "Bielorrússia", "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brunei", "Bulgária", "Burkina Faso", "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Coreia do Norte", "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti", "Dominica", "Equador", "Emirados Árabes Unidos", "Eritreia", "Eslováquia", "Eslovênia", "Espanha", "Eswatini", "Estônia", "Etiópia", "Fiji", "Filipinas", "Finlândia", "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala", "Guiana", "Guiné", "Guiné-Bissau", "Guiné Equatorial", "Haiti", "Honduras", "Hungria", "Iêmen", "Ilhas Marshall", "Ilhas Salomão", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", "Israel", "Jamaica", "Japão", "Jordânia", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letônia", "Líbano", "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", "Madagascar", "Malásia", "Malawi", "Maldivas", "Mali", "Malta", "Marrocos", "Maurícia", "Mauritânia", "México", "Mianmar", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia", "Omã", "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia", "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana", "República Checa", "República Democrática do Congo", "República do Congo", "República Dominicana", "Romênia", "Ruanda", "Rússia", "Samoa", "San Marino", "Santa Lúcia", "São Cristóvão e Névis", "São Tomé e Príncipe", "São Vicente e Granadinas", "Senegal", "Sérvia", "Serra Leoa", "Seychelles", "Singapura", "Síria", "Somália", "Sri Lanka", "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname", "Tailândia", "Tajiquistão", "Tanzânia", "Timor-Leste", "Togo", "Tonga", "Trinidad e Tobago", "Tunísia", "Turcomenistão", "Turquia", "Tuvalu", "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", "Vanuatu", "Vaticano", "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"]
, width=30)
combo_nivel.grid(row=0, column=1, pady=10, padx=10)

# Componentes
# Labels
lbl_mensagem_usuario = tk.Label(janela_bemvindo, text="Digite seu nome :)")
lbl_mensagem_usuario.grid(row=1, column=0, pady=10,padx=10)

lbl_mensagem_idade = tk.Label(janela_bemvindo, text="Digite sua idade :)")
lbl_mensagem_idade.grid(row=2, column=0, pady=10,padx=10)

lbl_mensagem_combo = tk.Label(janela_bemvindo, text="Selecione Seu pais :)")
lbl_mensagem_combo.grid(row=0, column=0, pady=10,padx=10)

lbl_mensagem_sexo = tk.Label(janela_bemvindo, text="Qual é o seu sexo? :)")
lbl_mensagem_sexo.grid(row=3, column=0, pady=10,padx=10)

# Entrys
usuario_nome = tk.Entry(janela_bemvindo, font = ("Arial", 12,))
usuario_nome.grid(row=1, column=1, pady=10,padx=10)

idade_usuario = tk.Entry(janela_bemvindo, font = ("Arial", 12))
idade_usuario.grid(row=2, column=1, pady=10,padx=10)

pessoa_sexo = tk.Entry(janela_bemvindo, font = ("Arial", 12))
pessoa_sexo.grid(row=3, column=1, pady=10,padx=10)

#botão
btn_enviar_mensagem = tk.Button(janela_bemvindo, text="Enviar mensagens", command = bemvindo)
btn_enviar_mensagem.grid(row=4, column=1, pady=10, padx=10)

btn_fechar = tk.Button(janela_bemvindo, text="fechar o mundo", command=janela_bemvindo.destroy, bg= "#f51010" )
btn_fechar.grid(row = 4, column=2,pady=10,padx=10)

btn_segunda_janela = tk.Button(janela_bemvindo, text="Abrir Segunda Janela", command=janela_segunda)
btn_segunda_janela.grid(row=4, column=0, pady=10, padx=10)

# Rodar interface
janela_bemvindo.mainloop()