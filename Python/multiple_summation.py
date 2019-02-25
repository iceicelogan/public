# Input to determine the sum of all numbers up to `maximum`
# With the condition that they are a multiple of a | b


def multiple_of_two_nums(number, multiple_a, multiple_b):
    if number % multiple_a == 0 or number % multiple_b == 0:
        return True
    else:
        return False


def multiple_summation(maximum, a, b):
    answer = 0
    for i in range(1, maximum):
        if multiple_of_two_nums(i, a, b):
            answer += i
    return answer
