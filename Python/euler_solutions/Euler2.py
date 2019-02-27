################################
#                              #
#     Solution to Euler 2      #
#     Sum(Even Fibonacci)      #
#          Below 4MM           #
#                              #
################################


# import time for benchmarking
import time


# Log the start time
start = time.time()


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
    first = 1
    prev = 1
    holder = 0
    lister = 0

    # Loop over the max_num entered
    for i in range(0, max_num):

        if holder == 0:

            # Special Case for holder = 0
            lister += first
            holder = 1
            print(i)

        else:

            # Add the number for a running sum here
            lister += first
            holder = first
            first += prev
            prev = holder
            print(i)

    # return the answer
    return lister


print(fib(4000000))


# Log time at the end of program execution
end = time.time()


# Print the total time taken for the program execution
print("This problem took "+str(round(end - start, 10))+" Seconds")
