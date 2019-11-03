####################################
#                                  #
#      Solution to Euler 12        #
#     Triangle Number Factors      #
#                                  #
####################################

# Brute force, takes 30m Plus. Need to refine algorithm, as it is sooooo slow.

tri_adder = 1
tri_number = 0
max_factors = 0

while max_factors < 500:
    factors = 0
    tri_number += tri_adder
    for i in range(1, tri_number+1):
        if tri_number % i == 0:
            factors += 1
    if factors > max_factors:
        print("Triangle Number %s has %s Factors" % (tri_number, factors))
        max_factors = factors
    tri_adder += 1
