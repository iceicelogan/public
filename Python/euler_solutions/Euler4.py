########################################
#                                      #
#        Solution to Euler 4           #
#     Largest Palindromic Product      #
#          3 digit x 3 digit           #
#                                      #
########################################

max = 0
for i in range(100,1000):
    for j in range(100,1000):
        s = str(i*j)
        if s == s[::-1]:
            if i*j > max:
                max = i*j
print(max)


