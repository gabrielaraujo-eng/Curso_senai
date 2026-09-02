print("sou um algortimco de viagem")
print("voce vai andar de \n- carro\n- onibus\n- aviao")
escolha = input("escolha com qual transporte ira: ")

if escolha == "carro":
    ab = int(input("qual o valor do abastecimento gasto: "))
    p = int(input("qual o valor do pedagio: "))
    print("o valor total gasto na viagem foi", ab + p)

elif escolha == "onibus":
    pg = int(input("qual o valor da passagem: "))
    seguro = 3.88
    print("o valor total gasto na viagem foi", pg + seguro)

elif escolha == "aviao":
    vg = int(input("qual o valor da viagem: "))
    tx = 55.2
    print("o valor total gasto na viagem foi", vg + tx)

else:
    print("programa encerado o codigo explodiu")