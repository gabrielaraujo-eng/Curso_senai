medidas = [50.1, 49.8, 52.0, 50.0, 48.5]
for list in medidas:
    print(f"{list}")
    if list >= 50:
        print("peça aprovada")
    if list < 50:
        print("peça reprovada")