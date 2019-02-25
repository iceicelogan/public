import time
from fractions import Fraction

start = time.time()

i_thing = []
j_thing = []
for i in range(10,99):
    for j in range(10,99):
        if (i/j)<1:
            i_thing.append(i)
            j_thing.append(j)
length = (len(i_thing))

top_sum = 1
bottom_sum = 1
count = 0
print("The Four Fractions Are: \n")
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

print("Multiplied together, we get: "+str(top_sum)+" over "+str(bottom_sum)+"\n Which condenses to: "+str(Fraction(int(top_sum),int(bottom_sum))))

#time at the end of program execution
end = time.time()

#Total time taken for the program execution
print("And it took "+str(end - start)+" Seconds")