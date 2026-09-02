print("===================================")
print("sou um algoritmo para calculo")
print("menu de opçoes")
print("1 - soma")
print("2 - subtracao")
print("3 - divisao")
print("4 - multiplicaçao")
print("===================================")
escolha = int(input("qual opçao deseja "))

if escolha == 1:
    s1 = int(input("fale um valor que deseja somar: "))
    s2 = int(input("fale outro valor que deseja somar: "))
    print("a soma deles resulta em,", s1 + s2)

elif escolha == 2:
    su1 = int(input("fale um valor que deseja subtrair: "))
    su2 = int(input("fale outro valor que deseja subtrair: "))
    print("a subtracao deles resulta em,", su1 - su2)

elif escolha == 3:
    d1 = int(input("fale um valor que deseja dividir: "))
    d2 = int(input("fale outro valor que deseja dividir: "))
    print("a divisao deles resulta em,", d1 / d2)

elif escolha == 4:
    m1 = int(input("fale um valor que deseja multiplicar: "))
    m2 = int(input("fale outro valor que deseja multiplicar: "))
    print("o produto deles resulta em,", m1 * m2)

else:
    print("o programa encerrou e voce explodiu o codigo")
