##############################################################
#                                                            #
# Function to input a list of lists and output a single list #
#                                                            #
##############################################################


# Function takes one input: a list (hopefully of other lists)
# If the list doesn't contain lists, it just returns the initial list
def flatten_list(a_list):

    # Initialize empty list to store data in
    b = []

    # Loop through each entry in input list
    for i in range(len(a_list)):

        # If the type of the entry is NOT a list, add it to b
        if type(a_list[i]) != list:
            b.append(a_list[i])

        # If the type of the entry IS a list, loop through its members and add each one to b
        else:
            for j in range(len(a_list[i])):
                b.append(a_list[i][j])

    # Return the newly formed list, b
    return b
