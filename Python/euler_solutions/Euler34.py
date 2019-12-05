#########################################
#                                       #
#          Solution to Euler 34         #
#            Factorial Fun              #
#                                       #
#########################################


def factorial(beta):
    runner = 1
    for i in range(1, beta+1):
        runner *= i
    return runner


def sum_of_fact(alpha):
    number_as_word = str(alpha)
    summer = 0
    for i in range(0, len(number_as_word)):
        summer += factorial(int(number_as_word[i]))
    return summer


running_sum = 0

for j in range(3, 100000):
    if j == sum_of_fact(j):
        running_sum += j

print(running_sum)
