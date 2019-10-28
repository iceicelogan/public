################################
#                              #
#     Solution to Euler 16     #
#       Power Digit Sum        #
#                              #
################################



numb = 2**1000
word = str(numb)
tot = 0
for i in range(0, len(word)):
    tot += int(word[i])
print(tot)