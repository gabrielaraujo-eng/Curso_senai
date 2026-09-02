for um in range(1, 11):
    print(f"1 x {um} = {um}")
    
n = int(input("qual tabuada deseja saber"))
for escolha in range(1, 11):
    r = escolha * n
    print(f"{escolha} x {n} = {r}")
