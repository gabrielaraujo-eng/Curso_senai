print("=====================")
print("Sou um algoritimico que calcula suas notas")
print("=====================")
nt_1 = int(input("Qual sua primeira nota: "))
nt_2 = int(input("Qual sua segunda nota: "))
nt_f = (nt_1 + nt_2) / 2
nome = input("qual seu nome: ")
if nt_f >= 50:
    print("Voce foi aprovado!","com a media de", nt_f,"parabens ", nome)

else:
    print("Voce foi reprovado.","com a media de", nt_f, "que pena!", nome)
