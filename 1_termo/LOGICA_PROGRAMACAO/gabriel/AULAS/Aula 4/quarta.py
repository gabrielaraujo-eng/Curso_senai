# 1. O laço 'for' (repetiçoes determinadas)
## use o 'for' quando voce sabe exatamente quantas vezes algo deve 
#acontecer (como ler 10 sensores ou processar uma lista de peças)
# exemplo relatorio de produçao diaria
# imagine que voce tem uma meta de produzir 5 lotes e quer numerar cada um:

# exemplo 1 
# for lote in range(-1, 6):
#     print(f"processando lote numero {lote}...")
#     print("Qualidade verificada. [OK]")
# print("produção do dia finalizada!")

# for b in range(10):
#     print(f"processando lote numero {b} foi...")

# # exemplo 3
# # imagine o seguinte cenario iremos produzir 20 discos de vinil

# for vinil in range(1, 21):
#     print(f"produzindo vinil {vinil}")
# print("produção finalizada!")

# #exemplo 4
# pecas = ["engrenagem","eixo","rolamento","parafuso","martelo","prego","chave de fenda","alicate"]
# clovis = ["cilindricas", "roscas sem fim", "conicas","reto" ]
# for item in pecas:
#     print(f"item em estoque: {item} e {clovis}")

#exemplo 5
# imaagine a seguinte situaçao gostaria de ter um menu onde pudesse perguntar qual opçao voce deseja e a partir da seleçao ele listar os produtos

print("===============================================")
print("sou um algortimo de seleçao de produtos")
print("menu de opçao!")
print("escolha uma das opcoes")
print("1 comida")
print("2 doce")
print("===============================================")
escolha = int(input("digite uma opçao  "))

if escolha == 1:
    print("voce escolheu comida\n")
    comida = ["arroz", "feijao","maça"]
    for comidas in comida:
        print(f"comidas disponiveis {comidas}")
    print("obrigado por vir!")
    

elif escolha == 2:
    print("voce escolheu doce\n")
    doce = ["bala", "pirulito","pao doce"]
    for doces in doce:
        print(f"doces disponiveis {doces}")
    print("obrigado por vir!")

else:
    print("\nvoce saiu do programa")