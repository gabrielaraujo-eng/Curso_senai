print("analise de peso do caminhão")
ps = int(input("qual peso atual do caminhão em toneladas "))

if ps < 10:
    print("carga leve")
elif ps < 25:
    print("carga padrão")
elif ps > 25:
    print("ALERTA: Excesso de Peso!")