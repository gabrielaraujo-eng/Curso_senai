# Revisão de conteudo:
#print = "função de saida de dados para o console"
#input = "função de entrada de dados do usuario via teclado"
#if = "estrutura de decisão para executar código condicionalmente"
#  elif =" combinação de else + if para verificar múltiplas condiçoes"
#    else = "parte opcional de um if que executa um codico quando a condição do if e falsa"
#  for =" Laço de repeetiçao para iteral sobre uma sequencia de elementos "
# while =" laco de repetição para executar codigo enquanto uma condição for verdadeira"
# operadores matematicos: "+,-,*,/,//,%,**"
# operadores de comparaçao:" ==,!=,>,,<,>=,<=,"
# variavel = "exemplo de variavel para armazenar dados"
# print(variavel)"


# #exemplo 1: com print e input
# nome = input("Digite seu nome: ")
# print(f"Olá, {nome}! Bem vindo à aula de Python para Desenvolvimento de Sistemas!")
# #exemplo 2: com if, elfi e else
# nota = float(input("Digite a nota do aluno: "))
# if nota >= 7:
#     print("Aluno aprovado!")
# elif nota >= 5:
#     print("Aluno em recuperação.")
# else:
#     print("Aluno reprovado.")
# #exemplo 3: com for
# materiais = ["metal", "plastico", "video",]
# for material in materiais:
#     print(f"Procesando mterial: {material}")
#     print(f"Material{material} procesando com sucesso!")
# print("Fim do processamento de materiais")

# # 2. O Laço while (repetições Indeterminadas)
# # Use o while quando voçe não sabe quando vai parar. Ele depende de uma condição (como um sensor de segurança ou um botão de emergencia)
# # exemplo: Monitor de temperatura (loop Infinito Controlado)
# # Repete enquanto a temperatura estiver segura
# import time
# temperatura = 0
# while temperatura < 1000:
#     print(f"Temperatura atual: {temperatura}°C. Sistema operando...")
#     time.sleep(0.0001)
#     temperatura += 0.0001 #simulando o aquecimento da maquina 
# print("ALERTA! Temperatura atingiu o limite. Desligando motor...")

# #lista de temperaturas lidas pelo sensor por minuto
# leituras = [99,70,75,82,98,110,85,80]
# for temp in leituras:
#     while temp > 100:
#         print(f"CRITICO: {temp}°C detectado! Acionando parada de emergencia.")
#         break #o loop para aqui e NÂo le os proximo valores [85,80]
#     print(f"Temperatura esta e {temp}°C. operação normal.")
# print("Sistema desligando. Aguardando manutenção")

materiais = ["metal", "metal", "plastico", "metal", "video", "metal","metal",]
for peca in materiais:
    if peca != "metal":
        print(f"Aviso: Peça de {peca} detctada. Desviando para descarte...")
        continue #Pule o restante do codigo abaixo e vai para a proxima peça 
    # este codigo só roda se a peça for metal
    print(f"Processando peça de {peca}. Furando e polindo...")
print("Fim do lote de produção. ")

