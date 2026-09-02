# while True:
#     m1 = int(input("qual o consumo da maquina 1"))
#     m2 = int(input("qual o consumo da maquina 2"))
#     m3 = int(input("qual o consumo da maquina 3"))
#     m4 = int(input("qual o consumo da maquina 4"))
#     m5 = int(input("qual o consumo da maquina 5"))
#     maquinas = [m1,m2,m3,m4,m5]
#     for maq in maquinas:
#       print(f"a quantidade de energia: {maq}KWM")
#     break

b = 0
for maq in range(1, 6):
    m1 = int(input(f"qual o consumo da {maq} N° em W"))
    maq = m1 / 1000
    b += m1
    print(f"o consumo da maquina em Kwm é: {maq}.")
    print(f"o consumo da fabrica em Kwm é: {b}.")

