import tkinter as tk
from tkinter import messagebox, ttk

#0 - janela
janela_biblioteca = tk.Tk()
janela_biblioteca.title("Biblioteca")
janela_biblioteca.geometry("400x600")
janela_biblioteca.configure(bg= "#1e2938")

#1 - def/funções
def emprestimo():
    nome = entry_nome.get()
    usuario = combo_usuario.get()
    livro = combo_livro.get()
    dias = int(entry_dias.get())
    if nome == "" or usuario == "" or livro == "" or dias == "":
        messagebox.showerror("Erro", "Por favor, preencha todos os campos.")

    if usuario == "Comunidade" and livro == "Raro":
        messagebox.showerror("Erro", "Desculpe, livros raros não estão disponíveis para a comunidade.")

    if usuario == "Aluno" and dias > 14:
        messagebox.showinfo("Observação","Acima de 14 dias tem uma taxa de 5 reais por dia extra")
        dias_extras = int(dias) - 14
        taxa = dias_extras * 5
        messagebox.showinfo("Taxa", f"Você tem uma taxa de R${taxa} por {dias_extras} dias extras.")
        messagebox.showinfo("Empréstimo Realizado", f"Olá {nome}, você é um {usuario} e escolheu o livro {livro} por {dias} dias e uma taxa de R${taxa}. Aproveite a leitura!")

    if usuario == "Comunidade" and dias > 7:
        messagebox.showinfo("Observação","Acima de 7 dias tem uma taxa de 5 reais por dia extra")
        dias_extras = int(dias) - 7
        taxa = dias_extras * 5
        messagebox.showinfo("Taxa", f"Você tem uma taxa de R${taxa} por {dias_extras} dias extras.")

    if usuario == "Comunidade" and dias <= 7:
        messagebox.showinfo("Empréstimo Realizado", f"Olá {nome}, você é um {usuario} e escolheu o livro {livro} por {dias} dias. Aproveite a leitura!")


#2 - componentes
lbl_biblioteca = tk.Label(janela_biblioteca, text="Bem Vindo a BIBLIOTECA", font = ("Arial", 18), bg= "#1e2938", fg= "#ffffff")
lbl_biblioteca.grid(row=0, column=0, pady=10,padx=10)

lbl_biblioteca2 = tk.Label(janela_biblioteca, text="Aqui você pode encontrar os melhores livros para ler", font = ("Arial", 12), bg= "#1e2938", fg= "#ffffff")
lbl_biblioteca2.grid(row=1, column=0, pady=15,padx=10)

lbl_nome = tk.Label(janela_biblioteca, text="Qual é o seu nome?", font = ("Arial", 12), bg= "#1e2938", fg= "#ffffff")
lbl_nome.grid(row=2, column=0, pady=10,padx=10)
entry_nome = tk.Entry(janela_biblioteca, font = ("Arial", 12))
entry_nome.grid(row=3, column=0, pady=10,padx=10)

lbl_usuario = tk.Label(janela_biblioteca,text= "Você é Aluno ou Comunidade", font = ("Arial", 12), bg= "#1e2938", fg= "#ffffff")
lbl_usuario.grid(row=4, column=0, pady=10,padx=10)

combo_usuario = tk.ttk.Combobox(janela_biblioteca, values=["Aluno", "Comunidade"])
combo_usuario.grid(row=5, column=0, pady=10,padx=10)

lbl_livro = tk.Label(janela_biblioteca, text="Qual livro você quer ler?", font = ("Arial", 12), bg= "#1e2938", fg= "#ffffff")
lbl_livro.grid(row=6, column=0, pady=10,padx=10)

combo_livro = tk.ttk.Combobox(janela_biblioteca, values=["Normal","Raro"])
combo_livro.grid(row=7, column=0, pady=10,padx=10)

lbl_dias = tk.Label(janela_biblioteca, text="Quantos dias você quer o livro?", font = ("Arial", 12), bg= "#1e2938", fg= "#ffffff")
lbl_dias.grid(row=8, column=0, pady=10,padx=10)
entry_dias = tk.Entry(janela_biblioteca, font = ("Arial", 12))
entry_dias.grid(row=9, column=0, pady=10,padx=10)


#3 - botoes
btn_enviar = tk.Button(janela_biblioteca, text="Enviar", command=emprestimo, bg= "#0400FF", fg= "#ffffff")
btn_enviar.grid(row=10, column=0, pady=10,padx=10)



#4 - loop
janela_biblioteca.mainloop()


