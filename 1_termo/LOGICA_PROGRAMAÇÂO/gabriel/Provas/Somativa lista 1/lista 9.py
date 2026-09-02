print("analise de pressão dos pneus")
pneu = int(input("qual a quantidade de psi do pneu"))

if pneu >= 100 and pneu <= 110:
    print("está dentro do padrão")
elif pneu > 111:
    print("acima do recomendado")
elif pneu < 99:
    print("abaixo do recomendado")
