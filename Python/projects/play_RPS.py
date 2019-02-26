#########################################
#                                       #
#    Let's Play Rock/Paper/Scissors!    #
# Game uses input() to play a PvC round #
#                                       #
#########################################


def play_rps():

    # import the random package so we can define a "random" computer input
    import random

    # Define a global variable of the User's name. Any input is allowed here.
    global player_name
    player_name = input("Welcome to the game! What is your name? ")

    # Define a nested function "initial input" that will be the start of our RPS game
    def initial_input():

        # Set up player and computer moves to be global, so they can be accessed beyond this method
        global player_move
        global computer_move

        # Ask the user for their weapon of choice
        player_move = input("Welcome, "+player_name + "! \nChoose your weapon: \nSelect rock, paper, or scissors:")

        # If the player does not select a correct weapon, make them choose again
        while player_move.lower() not in ['rock', 'paper', 'scissors']:
            player_move = input("Come on, "+player_name+", get it together! Pick 'rock', 'paper', or 'scissors': ")

        # Define the computer's move to be a random option of the 3 available.
        comp_test = random.randint(1, 3)
        if comp_test == 1:
            computer_move = 'rock'
        elif comp_test == 2:
            computer_move = 'paper'
        else:
            computer_move = 'scissors'

    # Now that we have our inputs, we can define a function to choose a winner
    def pick_winner():

        # First, call the initial_input function to get our moves
        initial_input()

        # If the move is the same as the computer's random move, have the player and computer choose again
        if player_move.lower() == computer_move:
            print("Draw! Choose Again, "+player_name+"!")
            pick_winner()

        # Nested boolean logic - Print the result of the game if there is no tie!
        elif player_move.lower() == 'rock':
            if computer_move == 'scissors':
                print(player_name+" Wins, Rock over Scissors!")
            else:
                print("Sorry, "+player_name+", the computer won - Paper over Rock")
        elif player_move.lower() == 'scissors':
            if computer_move == 'rock':
                print("Sorry, "+player_name+", the computer won - Rock over Scissors")
            else:
                print(player_name+" Wins, Scissors over Paper!")
        elif computer_move == 'scissors':
            print("Sorry, "+player_name+", the computer won - Scissors over Paper")
        else:
            print(player_name+" Wins, Paper over Rock!")

    # Call the function pick_winner (which in turn calls initial_input
    pick_winner()
