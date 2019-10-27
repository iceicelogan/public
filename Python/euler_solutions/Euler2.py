################################
#                              #
#     Solution to Euler 2      #
#     Sum(Even Fibonacci)      #
#          Below 4MM           #
#                              #
################################


###########################################
#                                         #
#  Function to return Fibonacci Sequence  #
#   Edited to only accept a sum, no list  #
#                                         #
###########################################


# Function takes one input --
# max_num is the number you want the sequence until
def fib(max_num):

    # Initialize our variables to loop across
    summed_value = 0
    i = 2
    prev = 1

    # Loop over the max_num entered
    while i < max_num:
        if i % 2 == 0:
            summed_value += i
        holder = i
        i += prev
        prev = holder

    # return the answer
    return summed_value


print(fib(4000000))
