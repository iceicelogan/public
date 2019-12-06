#########################################
#                                       #
#          Solution to Euler 44         #
#             Pentagon Nums             #
#                                       #
#########################################


def pent(alpha):
    return int(alpha * (3 * alpha - 1)/2)


lister = []

for i in range(1, 10000):
    lister.append(pent(i))

for j in range(1, 9999):
    for k in range(j, 9999):
        if (lister[j] + lister[k]) in lister:
            if (lister[k] - lister[j]) in lister:
                print("The " + j + " and " + k + " elements are good")

