n = input("qual o nome do seu produto comprado ")
m = int(input("Quantidade vendida desse produto "))
b = int(input("Preço unitário do produto "))
d1 = input("teve desconto na compra? s/n  ")
t = m * b
if d1 == "s":
    d2 = int(input("quanto % de desconto voce teve? "))
    d = d2 / t 
    d3 = t - d
    print("==========================")
    print("Relatório de Vendas")
    print("==========================")
    print("nome do produto :", n)
    print("Quantidade vendida:", m)
    print("Preço unitário: R$ ", b)
    print("Total de vendas: R$ ", t)
    print("desconto pela compra: ", d3)
    print("==========================")

else:
    print("==========================")
    print("Relatório de Vendas")
    print("==========================")
    print("nome do produto :", n)
    print("Quantidade vendida:", m)
    print("Preço unitário: R$ ", b)
    print("Total de vendas: R$ ", t)
    print("==========================")

