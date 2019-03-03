#############################################################
#                                                           #
#  Function to determine whether or not a number is prime   #
#                                                           #
#############################################################


# Function takes one input, the number you are querying
def is_prime(number):

    # Initialize our response variable
    truth = True

    # If the input is > 1, loop through all numbers until the square root of input
    # Check if modulo = 0, meaning a number fits evenly in it (aka not prime)
    # We can stop short at the square root,
    # as all other factors correspond to a lower number that we have already passed
    if number > 1:
        for i in range(2, int(round(number ** .5, 0))):
            if number % i == 0:
                truth = False
                break
        return truth

    # If the number is 1, we return True, as 1 = Prime
    elif number == 1:
        return True

    # If the number is not caught by the above logic, it is < 1, and necessarily not Prime
    else:
        return False


import time
t1 = time.time()

k = []
for m in range(1, 1000000):
    if is_prime(m):
        k.append(m)
t2 = time.time()

print("This took: "+str(t2-t1)+"sec, and found "+str(len(k))+" primes")

m = []
for i in range(len(k)):
    if len(str(k[i]))<6:
        continue
    else:
        if int(str)