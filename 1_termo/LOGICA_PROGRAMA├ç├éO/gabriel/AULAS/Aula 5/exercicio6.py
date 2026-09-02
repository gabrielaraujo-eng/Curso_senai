b = 0
while b < 5:
    
    # for pec in range(1, 6):
    p1 = int(input(f"temperatura atual da peça"))
    print(f"peças: {p1}.")
    print(f"o consumo da fabrica em Kwm é: {b}.")
    if p1 <= 0:
        print("erro de leitura no sensor")
        continue