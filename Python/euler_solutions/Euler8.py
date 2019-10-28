################################
#                              #
#     Solution to Euler 8      #
#     Pythagorean Multiple     #
#                              #
################################

# Trick to the problem is reducing dimensionality.
# Reduce to 2 variables by solving for c in terms of a and b

for i in range(1,1000):
    for j in range(1,1000):
            k = ((i**2+j**2)**.5)
            if k % 1 == 0:
                if i + j + k == 1000:
                    print(i*j*k)
