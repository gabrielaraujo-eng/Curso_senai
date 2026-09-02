import tkinter as tk
from tkinter import messagebox

# ---------------- PERGUNTAS ----------------
questions = [
    {
        "question": "O que é Tkinter?",
        "options": [
            "Uma biblioteca de banco de dados",
            "Uma biblioteca para interface gráfica (GUI)",
            "Um tipo de loop em Python",
            "Um framework de jogos"
        ],
        "answer": "Uma biblioteca para interface gráfica (GUI)"
    },
    {
        "question": "Qual comando cria a janela principal?",
        "options": [
            "tk.Window()",
            "tk.Frame()",
            "tk.Tk()",
            "tk.Main()"
        ],
        "answer": "tk.Tk()"
    },
    {
        "question": "Qual método mantém a janela aberta?",
        "options": [
            "mainloop()",
            "run()",
            "start()",
            "open()"
        ],
        "answer": "mainloop()"
    },
    {
        "question": "Qual widget é usado para mostrar texto?",
        "options": [
            "Entry",
            "Label",
            "Button",
            "Canvas"
        ],
        "answer": "Label"
    },
    {
        "question": "Qual widget serve para entrada de texto do usuário?",
        "options": [
            "Label",
            "Entry",
            "TextBox",
            "InputField"
        ],
        "answer": "Entry"
    },
    {
        "question": "Qual evento é usado em um Button?",
        "options": [
            "onclick",
            "command",
            "action",
            "event"
        ],
        "answer": "command"
    },
    {
        "question": "O que faz pack() no Tkinter?",
        "options": [
            "Fecha a janela",
            "Organiza os widgets na tela",
            "Cria uma janela",
            "Limpa o código"
        ],
        "answer": "Organiza os widgets na tela"
    },
    {
        "question": "Qual dessas opções cria um botão?",
        "options": [
            "tk.Button()",
            "tk.Click()",
            "tk.Push()",
            "tk.Btn()"
        ],
        "answer": "tk.Button()"
    },
    {
        "question": "Qual é o propósito do StringVar()?",
        "options": [
            "Guardar imagens",
            "Guardar valores dinâmicos de texto",
            "Criar janelas",
            "Criar loops"
        ],
        "answer": "Guardar valores dinâmicos de texto"
    },
    {
        "question": "O Tkinter é baseado em qual biblioteca?",
        "options": [
            "Java",
            "C++",
            "Tcl/Tk",
            "Python puro sem base"
        ],
        "answer": "Tcl/Tk"
    }
]

# ---------------- VARIÁVEIS ----------------
current_question = 0
score = 0

# ---------------- FUNÇÕES ----------------
def load_question():
    question_label.config(text=questions[current_question]["question"])

    for i in range(4):
        radio_buttons[i].config(
            text=questions[current_question]["options"][i],
            value=questions[current_question]["options"][i]
        )

    selected_answer.set(None)


def next_question():
    global current_question, score

    answer = selected_answer.get()

    if answer == questions[current_question]["answer"]:
        score += 1

    current_question += 1

    if current_question < len(questions):
        load_question()
    else:
        messagebox.showinfo("Resultado", f"Você acertou {score} de {len(questions)} perguntas!")
        root.destroy()


# ---------------- INTERFACE ----------------
root = tk.Tk()
root.title("Quiz Tkinter")
root.geometry("520x320")
root.config(bg="#1e1e1e")

title = tk.Label(root, text="QUIZ TKINTER", font=("Arial", 18, "bold"), bg="#1e1e1e", fg="white")
title.pack(pady=10)

question_label = tk.Label(root, text="", font=("Arial", 14), bg="#1e1e1e", fg="white", wraplength=480)
question_label.pack(pady=10)

selected_answer = tk.StringVar()

radio_buttons = []
for i in range(4):
    rb = tk.Radiobutton(
        root,
        text="",
        variable=selected_answer,
        value="",
        font=("Arial", 12),
        bg="#1e1e1e",
        fg="white",
        selectcolor="#333"
    )
    rb.pack(anchor="w", padx=40)
    radio_buttons.append(rb)

next_btn = tk.Button(root, text="Next", command=next_question, font=("Arial", 12))
next_btn.pack(pady=20)

load_question()

root.mainloop()
