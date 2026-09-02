din = int(input("Quanto voce ganha por mes? "))
gua = int(input("Quanto voce guarda por mes? "))

porcentagem = (gua / din) * 100

print("Voce guarda", porcentagem, "% do seu salario")

if porcentagem < 10:
    print("Voce precisa melhorar!")
elif porcentagem < 30:
    print("Voce esta no caminho certo!")
else:
    print("Excelente controle financeiro!")

if din > 1000:
    print("voce esta pronto para investir")
else:
    print("")

    din = int(input("Quanto voce ganha por mes? "))
