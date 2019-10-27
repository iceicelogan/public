#######################################
#                                     #
#          Solution to Euler 6        #
#             Sum of Squares          #
#          Less Square of Sums        #
#                                     #
#######################################



# Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.

sum = 0
for i in range (0,101):
    sum += i*i
print(sum)


sum_2 = 0
for j in range (0,101):
    sum_2 += j
print(sum_2*sum_2)

print((sum_2*sum_2) - sum)