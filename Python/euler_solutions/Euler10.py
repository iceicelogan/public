#########################################
#                                       #
#         Solution to Euler 10          #
#         Prime Sum < 2,000,000         #
#                                       #
#########################################

import time


def prime_sum(n):

    if n < 2:
        return 0
    if n == 2:
        return 2
    if n % 2 == 0:
        n += 1

    primes = [True] * n
    primes[0], primes[1] = [None] * 2
    summer = 0

    for ind, val in enumerate(primes):
        if val is True and ind > n ** 0.5 + 1:
            summer += ind
        elif val is True:
            primes[ind * 2::ind] = [False] * (((n - 1) // ind) - 1)
            summer += ind
    return summer


start = time.time()
summer = prime_sum(2000000)
elapsed = (time.time() - start)

print("found %s in %s seconds" % (summer, elapsed))
