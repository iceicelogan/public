def is_prime(number):
    truth = True
    if number > 1:
        for i in range(2, number**.5):
            if number % i == 0:
                truth = False
        return truth
    elif number == 1:
        return True
    else:
        return False
