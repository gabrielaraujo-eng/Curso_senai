banco_dados = ["Gabriel","adm00"]
tentativas = 0
print("== SISTEMA DE AVALIAÇÂO LINEAR ==")
while tentativas < 3:

    conta = input("Voce tem conta no sistema? (s/n): ")
    if conta == "s":
        nome_usuario = input("Qual nome do seu usuario?")
        usuario_login = input("Qual sua senha?")
        if nome_usuario in banco_dados and usuario_login in banco_dados:
            print("Acesso consedito, seja bem vindo ADM")
            break
        else:
            tentativas += 1
            print("Nao foi possivel encontrar sua conta")
    elif conta == "n":
        conta_2 = input("Gostaria de se cadastrar? (s/n): ")
        if conta_2 == "s":
            novo_usuario = input("Com qual nome quer se cadastrar?: ")
            nova_senha = input("Com qual senha quer se cadastrar?: ")

            banco_dados[novo_usuario] = nova_senha


            print("Volte a area de login e entre na sua mais nova conta.")
            continue
        if conta_2 == "n":
            print("cer§o")
            break
            
