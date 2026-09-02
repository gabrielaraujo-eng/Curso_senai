print("analise de autorização para iniciar rota")
checklist = input("o checklist foi concluido? [concluido]")
motorista = input("motorista foi indentificado?")
if checklist == "concluido" and motorista == "sim":
    print("veículo está autorizado a iniciar a rota.")
else:
    print("negado a iniciar rota")

#coreção do código
# checklist = input("o checklist foi concluido? [concluido]")
# motorista = input("motorista foi indentificado? [sim/não]")
# if checklist == "concluido" and motorista == "sim":
#     print("veículo está autorizado a iniciar a rota.")
# else:   
#     print("veículo não está autorizado a iniciar a rota.")
