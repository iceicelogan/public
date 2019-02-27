################################
#                              #
#     Solution to Euler 1      #
#     Multiples of 3 or 5      #
#          Below 1000          #
#                              #
################################


# import time for benchmarking
import time


# Log the start time
start = time.time()


# Set a sum = 0 and start an iterator at 3
sum = 0
i = 3


# Until i >= 1000, check if each number is divisible by 3 | 5
# If it is, add that to our running sum
while i < 1000:
    if i % 5 == 0 or i % 3 == 0:
        sum += i
    i += 1


# When finished, print our sum
print(sum)


# Log time at the end of program execution
end = time.time()


# Print the total time taken for the program execution
print("This problem took "+str(round(end - start, 10))+" Seconds")
