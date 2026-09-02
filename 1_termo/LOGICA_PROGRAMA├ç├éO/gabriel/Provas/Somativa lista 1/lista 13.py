# print("analise de acesso ao rastreador")
# while True:
#     b = "track99"
#     for b in range(3):
#         senha = input("o código de acesso do rastreador")
#         if senha == "track99":
#             print("acesso permitido")
#             break
#         elif senha != "track99":
#             print("acesso negado")
#     print("rastreamento bloqueado")

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