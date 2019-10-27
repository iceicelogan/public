################################
#                              #
#     Solution to Euler 3      #
#     Largest Prime Factor     #
#      of 600,851,475,143      #
#                              #
################################

###############################################################
#                                                             #
#        Function to list all prime factors of a number       #
#  Define functions for listing factors & defining primality  #
#                                                             #
###############################################################


########################################################
#                                                      #
#  Sub-function to list all factors of a given number  #
#                                                      #
########################################################


# Function takes one input, the number we would like to return factors of
def list_factors(number):

    # Initialize an empty list to store the factors
    lister = []

    # If the number is > 1, if has factors.
    # We loop through all numbers from 2:(square root(input)), and check if input modulo iterator = 0
    # If it does, that means the iterator is a factor!
    if number > 1:
        if float(int(number**.5)) == float(number**.5):
            lister.append(int(number**.5))
            for i in range(2, int(number**.5)):
                if number % i == 0:
                    lister.append(int(i))
                    lister.append(int(number/i))
        else:
            for i in range(2, int(round(number**.5, 0))):
                if number % i == 0:
                    lister.append(int(i))
                    lister.append(int(number/i))
        return sorted(lister)


#################################################################
#                                                               #
#  Sub-Function to determine whether or not a number is prime   #
#                                                               #
#################################################################


# Function takes one input, the number you are querying
def is_prime(number):

    # Initialize our response variable
    truth = True

    # If the input is > 1, loop through all numbers until the square root of input
    # Check if modulo = 0, meaning a number fits evenly in it (aka not prime)
    # We can stop short at the square root,
    # as all other factors correspond to a lower number that we have already passed
    if number > 1:
        for i in range(2, int(round(number**.5, 0))):
            if number % i == 0:
                truth = False
        return truth

    # If the number is 1, we return True, as 1 = Prime
    elif number == 1:
        return True

    # If the number is not caught by the above logic, it is < 1, and necessarily not Prime
    else:
        return False


# Function takes one input, the number you are querying
def prime_factor_list(num):

    # Initialize an empty list to store factors
    listing = []

    # Loop through all factors of a number, checking primality.
    # If the factors are prime, append to the list
    for i in list_factors(num):
        if is_prime(i):
            listing.append(i)

    # Return the list of factors
    return listing


print(prime_factor_list(600851475143))
