################################
#                              #
#     Solution to Euler 14     #
#     Longest Collatz Seq      #
#                              #
################################


sum = 0
i = 1
while i < 1000000:
    tempsum = 1
    j = i
    while j > 1:
        if j % 2 == 0:
            j = j/2
            tempsum += 1
        else:
            j = (3*j + 1)/2
            tempsum += 2
    if tempsum > sum:
        print(str(i)+" produced a length "+str(tempsum))
        sum = tempsum
    i += 1
