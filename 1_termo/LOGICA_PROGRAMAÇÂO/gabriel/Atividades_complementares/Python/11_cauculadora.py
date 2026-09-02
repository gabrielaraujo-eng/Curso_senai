# criar calculadora
import tkinter as tk
from tkinter import messagebox

#configurações da janela
janela = tk.Tk()
janela.title("Calculadora - Grafica")
janela.geometry("400x400")
# janela.config(bg = "#1e2134")

# definindo variaveis
numero = ""
num1 = 0 
num2 = 0
operacao = ""
visor = ""

#defs
def um():
    adicionar("1")
def dois():
    adicionar("2")
def tres():
    adicionar("3")
def quatro():
    adicionar("4")
def cinco():
    adicionar("5")
def seis():
    adicionar("6")
def sete():
    adicionar("7")
def oito():
    adicionar("8")
def nove():
    adicionar("9")
def zero():
    adicionar("0")

def adicionar(valor):
    global numero,visor
    numero += valor
    visor += valor
    lbl_visor.config(text=f"{visor}")

def soma():
    global numero,operacao,num1,visor
    if numero != "":
        num1 = int(numero)
        numero = ""
        operacao = "+"
        visor += "+"
        lbl_visor.config(text=visor)
    
def subtracao():
    global numero,operacao,num1,visor
    if numero != "":
        num1 = int(numero)
        numero = ""
        operacao = "-"  
        visor += "-"
        lbl_visor.config(text=visor)
        

def multiplicacao():
    global numero,operacao,num1,visor
    if numero != "":
        num1 = int(numero)
        numero = ""
        operacao = "*"  
        visor += "*"
        lbl_visor.config(text=visor)

def divisao():
    global numero,operacao,num1,visor
    if numero != "":
        num1 = int(numero)
        numero = ""
        operacao = "/"
        visor += "/"
        lbl_visor.config(text=visor)

def limpar():
    global numero, num1, num2, operacao, visor

    numero = ""
    num1 = 0
    num2 = 0
    operacao = ""
    visor = ""

    lbl_visor.config(text="0")


def igual():
    global numero,num1,num2,operacao,visor
    
    resultado = 0
    if numero == "":
        return
    num2 = int(numero)
    if operacao == "+":
        resultado = num1 + num2
    elif operacao == "-":
        resultado = num1 - num2
    elif operacao == "*":
        resultado = num1 * num2
    elif operacao == "/":
        if num2 == 0:
            resultado = "Erro"
        else:
            resultado = num1/num2
    else:
        return
    lbl_visor.config(text=(f"{resultado:.2f}"))

    numero = str(resultado)
    num1 = resultado
    operacao = ""
    visor = str(resultado)

#componentes da tela
lbl_visor = tk.Label(janela, text="Calcule!", font=("Arial", 18))

btn_um = tk.Button(janela, text="1", font=("Arial", 14), command=um)
btn_dois = tk.Button(janela, text="2", font=("Arial", 14), command=dois)
btn_tres = tk.Button(janela, text="3", font=("Arial", 14), command=tres)
btn_quatro = tk.Button(janela, text="4", font=("Arial", 14),command=quatro)
btn_cinco = tk.Button(janela, text="5", font=("Arial", 14),command=cinco)
btn_seis = tk.Button(janela, text="6", font=("Arial", 14), command=seis)
btn_sete = tk.Button(janela, text="7", font=("Arial", 14), command=sete)
btn_oito = tk.Button(janela, text="8", font=("Arial", 14), command=oito)
btn_nove = tk.Button(janela, text="9", font=("Arial", 14), command=nove)
btn_zero = tk.Button(janela, text="0", font=("Arial", 14), command=zero)

btn_soma = tk.Button(janela,text="+", font=("Arial", 14), command=soma)
btn_subtracao = tk.Button(janela,text="-", font=("Arial", 14), command=subtracao)
btn_multipicacao = tk.Button(janela,text="*", font=("Arial", 14), command=multiplicacao)
btn_divisao = tk.Button(janela,text="/", font=("Arial", 14), command=divisao)
btn_limpar = tk.Button(janela,text="C", font=("Arial", 14), command=limpar)
btn_igual = tk.Button(janela,text="=", font=("Arial", 14), command=igual)

#local onde fica os componentes
lbl_visor.grid(row=0,column=0,columnspan=4)

btn_um.grid(row=1, column=0)
btn_dois.grid(row=1, column=1)
btn_tres.grid(row=1, column=2)
btn_quatro.grid(row=2, column=0)
btn_cinco.grid(row=2, column=1)
btn_seis.grid(row=2, column=2)
btn_sete.grid(row=3, column=0)
btn_oito.grid(row=3, column=1)
btn_nove.grid(row=3, column=2)
btn_zero.grid(row=4, column=0)

btn_limpar.grid(row=4, column=2)
btn_soma.grid(row=1, column=3)
btn_subtracao.grid(row=2, column=3)
btn_multipicacao.grid(row=3, column=3)
btn_divisao.grid(row=4, column=3)
btn_igual.grid(row=5, column=3)


#loop da janela
janela.mainloop()
