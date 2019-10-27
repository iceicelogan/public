#################################
#                               #
#        Solution to Euler 5    #
#          Smallest Number      #
#          Divisible 1-20       #
#                               #
#################################


# ASSUMPTIONS:
# 1. Start at 2520, as that is the lowest divisible by 1-10
# 2. Increment by 2520, since you must be divisible 1-10
# 3. You need only check 11-20, as you know multiples of 2520 work.

i = 0
j = 2520
while i == 0:
    if j % 20 == 0:
        if j % 19 == 0:
            if j % 18 == 0:
                if j % 17 == 0:
                    if j % 16 == 0:
                        if j % 15 == 0:
                            if j % 14 == 0:
                                if j % 13 == 0:
                                    if j % 12 == 0:
                                        if j % 11 == 0:
                                            print(j)
                                            i = 1
    j += 2520

