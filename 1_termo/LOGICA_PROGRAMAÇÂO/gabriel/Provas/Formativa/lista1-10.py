n = input("qual o nome do seu produto comprado ")
m = int(input("Quantidade vendida desse produto "))
b = int(input("Preço unitário do produto "))
t = m * b


print("==========================")
print("Relatório de Vendas")
print("==========================")
print("nome do produto :", n)
print("Quantidade vendida:", m)
print("Preço unitário: R$ ", b)
print("Total de vendas: R$ ", t)
print("==========================")