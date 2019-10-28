################################
#                              #
#     Solution to Euler 20     #
#       Fact. Digit Sum        #
#                              #
################################


prod = 1
for i in range(1,101):
    prod *= i

numb = prod
word = str(numb)
tot = 0
for i in range(0, len(word)):
    tot += int(word[i])
print(tot)