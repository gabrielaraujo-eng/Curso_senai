print("analise de indice de entregas atrasadas")
eg = int(input("total de entregas agendadas"))
ra = int(input("total de entregas realizadas com atraso"))
ind = ra / eg * 100

if ind >= 10:
    print(f"Necessário Otimizar Rotas")
elif ind <= 10:
    print("Logística Eficiente")
