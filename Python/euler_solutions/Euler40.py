################################
#                              #
#     Solution to Euler 40     #
#    Champernowne's constant   #
#                              #
################################

stringy = ""
for i in range(1, 200000):
    stringy = stringy+str(i)
print(int(stringy[0]) *
      int(stringy[9]) *
      int(stringy[99]) *
      int(stringy[999]) *
      int(stringy[9999]) *
      int(stringy[99999]) *
      int(stringy[999999]))
