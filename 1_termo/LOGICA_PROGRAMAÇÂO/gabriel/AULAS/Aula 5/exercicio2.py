import time
semaforo = ["Verde","Amarelo","Vermelho"]
for sema in semaforo:
    time.sleep(1)
    print(f"{sema}")
    if sema == "Amarelo":
        print("ta com defeito o amarelo cara ")
    