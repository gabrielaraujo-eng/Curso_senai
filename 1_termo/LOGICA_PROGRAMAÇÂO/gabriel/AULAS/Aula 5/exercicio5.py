b = 0
for sac in range(1, 6):
    s1 = int(input(f"qual peso do saco {sac} "))
    if 47 < s1 < 53:
       print(f"{s1} dentro do limite!")
       b += 1
    else:
        print("fora do limite")
print(f"{b}")
