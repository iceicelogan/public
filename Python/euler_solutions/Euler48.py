#########################################
#                                       #
#          Solution to Euler 48         #
# string of powers to the power #
#                                       #
#########################################

summy = 0
for i in range(1, 1001):
    summy += i**i

string = str(summy)
length = len(string)
print(string[length-10:length])
