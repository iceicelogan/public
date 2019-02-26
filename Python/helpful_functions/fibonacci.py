###########################################
#                                         #
#  Function to return Fibonacci Sequence  #
#    Use variable to define sum or list   #
#                                         #
###########################################


# Function takes two inputs --
# max_num is the number you want the sequence until
# output is list | sum, defining how the function operates
def fib(max_num, output= "list"):

    # Boolean Logic to determine the output
    if output == "list":

        # initialize variables at 1, and a holder variable for temp storage
        first = 1
        prev = 1
        holder = 0

        # initialize lister as a list, as that was the selected output
        lister = []

        # Loop through each number from 0 - max_num and append the new variable to the list at each step
        for i in range(0, max_num):

            if holder == 0:
                lister.append(first)
                holder = 1

            else:
                lister.append(first)
                holder = first
                first += prev
                prev = holder

    # Boolean Logic if output is sum
    elif output == "sum":
        first = 1
        prev = 1
        holder = 0

        # NOTE- lister is an int here instead of list
        lister = 0
        for i in range(0, max_num):

            if holder == 0:

                # Instead of appending, we add here
                lister += first
                holder = 1

            else:

                # Same here, add instead of append
                lister += first
                holder = first
                first += prev
                prev = holder

    # If output was defined wrong, return an error
    else:
        raise NameError('Output Must be sum or list')

    # return the answer, if there was no error
    return lister
