#1
print("registro de veículo")
modelo = input("qual o modelo do seu veiculo")
placa = int(input("qual a placa do seu veiculo"))
print(f"Veículo {modelo} de placa {placa} registrado no sistema. Boa viagem!")
#2
print("calculo de autonomia do veiculo")
litros = int(input("qual capacidade do tanque de combustível em litros"))
km = int(input("quantos km ele percorre com 1 litro")) #consumo medio do veiculo
total = km * litros
print(f"o veiculo pode percorrer {total}km com o tanque cheio")
#3
print("conversão de dolar para real")
dolar = float(input("qual a quantidade em dolar que deseja converter para reais"))
brl = dolar * 5
total = round(brl,2)
print(f"a quantidade convertida é {total}")
#4
print("calculo da media de tempo gasto em corridas")
c1 = int(input("tempo de entrega em horas da primeira corrida"))
c2 = int(input("tempo de entrega em horas da segunda corrida"))
c3 = int(input("tempo de entrega em horas da terceira corrida"))
mat = c1 + c2 + c3 / 3
print(f"a media simples de gasto de horas é {mat}")
#5
print("analise de peso do caminhão")
ps = int(input("qual peso atual do caminhão em toneladas "))

if ps < 10:
    print("carga leve")
elif ps < 25:
    print("carga padrão")
elif ps > 25:
    print("ALERTA: Excesso de Peso!")
#6
print("analise de regiao de carga")
cd = (input("código da carga n/s "))
if cd == "n":
    print("Região Norte")
elif cd == "s":
    print("Região Sul")
else:
    print("Região Internacional")
#7
print("analise de autorização para iniciar rota")
checklist = input("o checklist foi concluido? [concluido]")
motorista = input("motorista foi indentificado?")
if checklist == "concluido" and motorista == "sim":
    print("veículo está autorizado a iniciar a rota.")
else:
    print("negado a iniciar rota")
#8
print("analise de indice de entregas atrasadas")
eg = int(input("total de entregas agendadas"))
ra = int(input("total de entregas realizadas com atraso"))
ind = ra / eg * 100
if ind >= 10:
    print(f"Necessário Otimizar Rotas")
elif ind <= 10:
    print("Logística Eficiente")
#9
print("analise de pressão dos pneus")
pneu = int(input("qual a quantidade de psi do pneu"))

if pneu >= 100 and pneu <= 110:
    print("está dentro do padrão")
elif pneu > 111:
    print("acima do recomendado")
elif pneu < 99:
    print("abaixo do recomendado")
#10
print("analise de tempo para trancar o portão")
import time

for b in range(5,0,-1):
    time.sleep(1)
    print(b)
print("Portão Trancado!")
#11
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
#12
print("analise de quilometragem dos veiculos")
b = []
for i in range(5):
    v = int(input(f"qual a quilometragem do veiculo {i+1} "))
    b.append(v)
    maior = max(b)
print(f"a maior quilometragem é {maior}")
##### mmmmmuuuuuiiiiitoooo confuso de aprender
#13
print("analise de acesso ao rastreador")
sc = "track99"
tentativas = 0
while tentativas < 3:
    senha = input("Digite o código de acesso do rastreador: ")
    if senha == sc:
        print("acesso permitido")
        break
    else:
        print("acesso negado")
        tentativas += 1
if tentativas == 3:
    print("rastreamento bloqueado")
#fim