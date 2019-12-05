#########################################
#                                       #
#          Solution to Euler 21         #
#            Amicable Numbers           #
#                                       #
#########################################


def divisors(alpha):
    i = 1
    summer = 0
    while i <= alpha/2:
        if alpha % i == 0:
            summer += i
        i += 1
    return summer


total_sum = 0

for j in range(3, 10000):
    if j == divisors(divisors(j)):
        if divisors(j) != j:
            total_sum += j

print(total_sum)
