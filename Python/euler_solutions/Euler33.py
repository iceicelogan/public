################################
#                              #
#     Solution to Euler 33     #
#  Digit Cancelling Fractions  #
#                              #
################################


# import time for benchmarking and Fraction to simplify fractions
import time
from fractions import Fraction


# Log the start time
start = time.time()


# Initialize two empty lists
i_thing = []
j_thing = []


# Loop through 10-99 89 times (as we know the numerator and denominator are both 10-99
# If it's a proper fraction, append the numerator and denominator to i and j respectively
for i in range(10, 99):
    for j in range(10, 99):
        if (i/j) < 1:
            i_thing.append(i)
            j_thing.append(j)


# Store a variable for the length of i_thing so we reduce our function calls
length = (len(i_thing))


# Initialize variables so we don't explode the world with a division by 0
top_sum = 1
bottom_sum = 1
count = 0


# print some language to help us understand the output
print("The Four Fractions Are: \n")


# Loop through the cases of i_thing / j_thing, cancelling parts of the numbers.
# Must loop through a couple cases, removing any case that would result in division by 0
for i in range(int(length)):
    if int(str(j_thing[i])[1]) != 0 and int(str(j_thing[i])) != 0:
        if str(i_thing[i])[0] == str(j_thing[i])[0]:
            if int(str(i_thing[i])[1]) / int(str(j_thing[i])[1]) == int(str(i_thing[i])) / int(str(j_thing[i])):
                print(str(i_thing[i])+" over "+str(j_thing[i])+"\n")
                top_sum *= int(str(i_thing[i]))
                bottom_sum *= int(str(j_thing[i]))

        elif str(i_thing[i])[0] == str(j_thing[i])[1]:
            if int(str(i_thing[i])[1]) / int(str(j_thing[i])[0]) == int(str(i_thing[i])) / int(str(j_thing[i])):
                print(str(i_thing[i])+" over "+str(j_thing[i])+"\n")
                top_sum *= int(str(i_thing[i]))
                bottom_sum *= int(str(j_thing[i]))

        elif str(i_thing[i])[1] == str(j_thing[i])[0]:
            if int(str(i_thing[i])[0]) / int(str(j_thing[i])[1]) == int(str(i_thing[i])) / int(str(j_thing[i])):
                print(str(i_thing[i])+" over "+str(j_thing[i])+"\n")
                top_sum *= int(str(i_thing[i]))
                bottom_sum *= int(str(j_thing[i]))

        elif str(i_thing[i])[1] == str(j_thing[i])[1]:
            if int(str(i_thing[i])[0]) / int(str(j_thing[i])[0]) == int(str(i_thing[i])) / int(str(j_thing[i])):
                print(str(i_thing[i])+" over "+str(j_thing[i])+"\n")
                top_sum *= int(str(i_thing[i]))
                bottom_sum *= int(str(j_thing[i]))


# With the hard work complete, print our top and bottom sums
print("Multiplied together, we get: " +
      str(top_sum) + " over "+str(bottom_sum) +
      # Condense the fraction using the Fraction function
      "\n Which condenses to: " +
      str(Fraction(int(top_sum), int(bottom_sum))))

# Log time at the end of program execution
end = time.time()

# Print the total time taken for the program execution
print("And it took "+str(round(end - start, 3))+" Seconds")
