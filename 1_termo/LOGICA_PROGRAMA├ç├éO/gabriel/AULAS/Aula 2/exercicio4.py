n = input("digite o nome do livro:")
v = int(input("digite o valor do livro:"))
q = int(input("digite a quantidade do livro:"))
d = int(input("digite o desconto do livro:"))
pc = (v * q * d) / 100
 #me confundi mais da certo

print("o nome do livro e:", n)
print("o valor do livro e:", v)
print("a quantidade do livro e:", q)
print("o desconto do livro e:", d)
print("o total da compra e:",v - pc)

