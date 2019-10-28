################################
#                              #
#     Solution to Euler 7      #
#        10,001st Prime        #
#                              #
################################



# Function takes one input, the number you are querying
def is_prime(number):

    # Initialize our response variable
    truth = True

    # If the input is > 1, loop through all numbers until the square root of input
    # Check if modulo = 0, meaning a number fits evenly in it (aka not prime)
    # We can stop short at the square root,
    # as all other factors correspond to a lower number that we have already passed
    if number > 1:
        for i in range(2, number//2 +1):
            if (number % i) == 0:
                truth = False
        return truth

    # If the number is 1, we return True, as 1 = Prime
    elif number == 1:
        return True

    # If the number is not caught by the above logic, it is < 1, and necessarily not Prime
    else:
        return False


i = 1
total = 0

while total <= 10001:
    if is_prime(i):
        total += 1
        print(str(i)+" is the "+str(total))
    i += 1


