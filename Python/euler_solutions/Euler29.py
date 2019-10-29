################################
#                              #
#     Solution to Euler 29     #
#              a^b             #
#                              #
################################

list = []
for i in range(2, 101):
    for j in range(2, 101):
        if i**j not in list:
            list.append(i**j)

print(len(list))
