#########################################
#                                       #
#          Solution to Euler 45         #
# Triangular, pentagonal, and hexagonal #
#                                       #
#########################################

# Triangle	 	Tn=n(n+1)/2	 	1, 3, 6, 10, 15, ...
# Pentagonal	 	Pn=n(3n−1)/2	 	1, 5, 12, 22, 35, ...
# Hexagonal	 	Hn=n(2n−1)	 	1, 6, 15, 28, 45, ...
# It can be verified that T285 = P165 = H143 = 40755.

t = []
p = []
h = []

for i in range(1, 100000):
    t.append(i*(i+1)/2)
    p.append(i*(3*i-1)/2)
    h.append(i*(2*i-1))

print(len(t))
print(len(p))
print(len(h))

for j in range(1, 99990):
    if t[j] in p:
        if t[j] in h:
            print(t[j])
