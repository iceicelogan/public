def list_factors(number):
    lister = []
    if number > 1:
        for i in range(2, number):
            if number % i == 0:
                lister.append(i)
    return lister
