def play_RPS():
    def initialinput():
        global player1move
        global player2move
        player1move = input("Player1: Choose your weapon! ")
        while player1move not in ['rock','paper','scissors']:
            player1move = input("Come on, Player 1, get it together! Pick 'rock', 'paper', or 'scissors': ")
        player2move = input("Ok, cool. Player2: Choose your weapon: ")
        while player2move not in ['rock','paper','scissors']:
            player2move = input("Come on, Player 2, get it together! Pick 'rock', 'paper', or 'scissors': ")

    def pick_winner():
        initialinput()
        if player1move == player2move:
            print("Draw! Choose Again: ")
            pick_winner()
        elif player1move == 'rock':
            if player2move == 'scissors':
                print("Player 1 Wins, Rock over Scissors!")
            else:
                print("Player 2 Wins, Paper over Rock!")
        elif player1move == 'scissors':
            if player2move == 'rock':
                print("Player 2 Wins, Rock over Scissors!")
            else:
                print("Player 1 Wins, Scissors over Paper!")
        elif player2move == 'scissors':
            print("Player2 Wins, Scissors over Paper!")
        else:
            print("Player1 Wins, Paper over Rock!")
    pick_winner()

play_RPS()