print("calculando a % de defesa dos goleiros")
print("#em penaltes#")
print("CORINTHIANS")

nome_goleiro = input("Qual o nome do goleiro?\n").lower()

if nome_goleiro == "hugo souza": #nomes ja cadastrados
    print("Hugo Souza tem 13.72% de defesas.")

elif nome_goleiro == "cassio":
    print("Cassio tem 4.49% de defesas.")
elif nome_goleiro == "dida":
    print("Dida tem 6.31% de defesas")

else:
    def defesa_porcen(): #se nao tiver cadastrado, calcula, return o calculo
        jogo = int(input("Quantos jogos ele tem?\n"))
        defesa = int(input("Quantas defesas ele tem?\n"))
        porcentagem = defesa / jogo * 100
        return porcentagem

    resultado = defesa_porcen() #print do calculo
    print("O", nome_goleiro, "tem", resultado, "% de defesas")

