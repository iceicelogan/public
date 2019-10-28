################################
#                              #
#     Solution to Euler 25     #
#       1,000 Digit Fib        #
#                              #
################################


summed_value = 0
i = 2
prev = 1
length = 0
rank = 3
while length < 1000:
    length = len(str(i))
    print(str(rank)+" has length "+str(length))
    holder = i
    i += prev
    prev = holder
    rank += 1
