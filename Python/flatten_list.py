def flatten_list(a_list):
    b = []

    for i in range(len(a_list)):

        if type(a_list[i]) != list:
            b.append(a_list[i])

        else:
            for j in range(len(a_list[i])):
                b.append(a_list[i][j])

    return b
