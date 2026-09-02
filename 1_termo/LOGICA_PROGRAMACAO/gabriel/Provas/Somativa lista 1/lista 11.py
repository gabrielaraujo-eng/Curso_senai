print("sou uma maquina que pede valores e repete infinitas vezes ate voce cansar")
b = 0 
while True:
    t = int(input("valor do frete "))
    c = input("quer continuar? s/n")
    b += t
    if c == "s":
        continue
    else:
        break
print(f"{b} foi o faturamento total acumulado")


