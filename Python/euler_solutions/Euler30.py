#########################################
#                                       #
#          Solution to Euler 30         #
#             5th Power Sum             #
#                                       #
#########################################


def sum_of_fifth(alpha):
    number_as_word = str(alpha)
    summer = 0
    for i in range(0, len(number_as_word)):
        summer += int(number_as_word[i])**5
    return summer


running_sum = 0
for j in range(2,1000000):
    if j == sum_of_fifth(j):
        running_sum += j
        print(j)

print(running_sum)
