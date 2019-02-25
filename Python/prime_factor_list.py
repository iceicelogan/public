def list_factors(number):
    lister = []
    if number > 1:
        for i in range(2, number):
            if number % i == 0:
                lister.append(i)
    return lister

def is_prime(number):
    truth = True
    if number > 1:
        for i in range(2, number):
            if number % i == 0:
                truth = False
        return truth
    elif number == 1:
        return True
    else:
        return False


def prime_factor_list(num):
    listing = []
    for i in list_factors(num):
        if is_prime(i):
            listing.append(i)
    return listing