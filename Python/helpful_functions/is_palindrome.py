##########################################################
#                                                        #
#   Short Function to determine if number is palindrome  #
#                                                        #
##########################################################


# Function only takes one input, the number in question
def num_is_pal(num):

    # Reverse the string and do a boolean check
    # If it's the same as the original, it's a palindrome!
    if str(num) == str(num)[::-1]:
        return True
    else:
        return False
