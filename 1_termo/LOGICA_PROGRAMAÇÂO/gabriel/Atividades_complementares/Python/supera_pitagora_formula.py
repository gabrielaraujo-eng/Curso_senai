def calcular_k(div): #calcula K
    k = (div**2 + 1)**0.5 - div
    return k

def calcular_c(a, b, k): #calcula C
    c = k * b + a
    return c

def mostrar_triangulo(a, b, c, k): #tricangulo de forma grafica
    print("\nVisualização aproximada do triângulo (não é escala real):\n")
    print("          |\\")
    print(f"          | \\  C ≈ {c:.2f}")
    print(f" A ≈ {a:.2f} |  \\")
    print("          |   \\")
    print("          |    \\")
    print(f"          |     \\")
    print(f"          |      \\")
    print(f"          |       \\")
    print(f"          ---------")
    print(f"           B ≈ {b:.2f}")
    print(f"\nCoeficiente K ≈ {k:.4f}\n")
    print("============================\n")

def main():
    while True: #menu
        print("\nCalculadora de hipotenusa de triangulos (C)")
        print("---------------------")
             # define a e b com perguntas
        a = float(input("Digite o valor de A (menor cateto):\n"))
        b = float(input("Digite o valor de B (maior cateto):\n"))
             # define K com pergunta
        sabe_k = input("Você já sabe o valor de K? (s/n)\n").lower()
        if sabe_k == "s": # resposta S
            k = float(input("Digite o valor de K:\n"))
        else:  # outra resposta calula por si proprio
            div = a / b # define a variavel div
            k = calcular_k(div) #chama a dev
            print(f"O valor de K (calculado) é: {k}")

        c = calcular_c(a, b, k) #chama a dev 
        print(f"O valor de C (hipotenusa) é: {c}")

        escolha = input("Quer saber o que aconteceu com a fórmula? (s/n)\n").lower()
        if escolha == "s":
            print("============================") #explicaçao da formula
            print("Usando a fórmula Kb + a = c (criada por mim)")
            print("Portanto K = (a/b)^2 + 1)**0.5 - a/b")
            print("============================")

        grafico = input("Quer ver o triângulo de forma gráfica? (s/n)\n").lower()
        if grafico == "s": #mostra o grafico chamando a dev
            mostrar_triangulo(a, b, c, k)

        sair = input("Deseja calcular outro triângulo? (s/n)\n").lower()
        if sair != "s": #encera o programa 
            print("Saindo da magia de Gabriel ✨")
            break
        
if __name__ == "__main__":
    main()