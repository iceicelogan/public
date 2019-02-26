#####################################################
#                                                   #
#  Function to list all factors of a given number   #
#                                                   #
#####################################################


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
