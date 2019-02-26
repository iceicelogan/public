def fib(max_num):
    first = 1
    prev = 1
    holder = 0
    lister = []
    for i in range(0, max_num):

        if holder == 0:
            lister.append(first)
            holder = 1

        else:
            lister.append(first)
            holder = first
            first += prev
            prev = holder
    return lister

print(fib(5))