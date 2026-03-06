// get the textHolder paragraph
const textHolder = document.querySelector(".text-holder");

// create an IIFE that will store the gameboard and a method for making a move
const Gameboard = (() => {
  // this is where the gameboard will be stored
  const gameboard = [
    "", "", "",
    "", "", "",
    "", "", ""
  ];
  
  // a function that displays the gameboard 
  const displayBoard = () => {
    const boardDiv = document.querySelector(".gameboard"); // this is where we will store the cells
    boardDiv.textContent = "";  // initially set it's textContent to nothing
    
    // for each element in gameboard create a div for it
    for (let i = 0; i < gameboard.length; i++) {
      const cell = document.createElement("div"); // create the div
      
      // if cell already marked "X" or "O", add a class of cell's value (X or O)
      if (gameboard[i] === "X" || gameboard[i] === "O") cell.classList.add(gameboard[i]);
      cell.classList.add("cell");  // make cell to have a class of "cell"
      cell.textContent = gameboard[i]; // set it's textContent to the value of the current element

      // when a cell is clicked, call ScreenController.playRound(cell)
      cell.addEventListener("click", () => {ScreenController.playRound(i)});
      boardDiv.appendChild(cell); // append cell to boardDiv
    }
  };

  // function that gets gameboard
  const getBoard = () => gameboard;

  // create a function for making a move
  const makeMove = (cell, marker) => {
    if (gameboard[cell] !== "") return false; // if the selected cell is already taken, return false
    gameboard[cell] = marker; // else set the selected cell to marker
  };

  // a function for reseting the gameboard
  const resetBoard = () => {
    // reset all elements in gameboard to an empty string
    for (let i = 0; i < gameboard.length; i++) {
      gameboard[i] = "";
    };
  };
  
  return {displayBoard, makeMove, getBoard, resetBoard};
})();

// a function responsible for controlling the flow, state of the game's turns and if anybody has won the game
const ScreenController = ((
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) => {
  // this variable will keep be used for checking if there is a winner or tie
  let winnerOrTie = false;
  
  // factory for creating players
  function CreatePlayer(name, marker) {
    return {name, marker} // return {name: `${name}`, marker: `${marker}`}
  };
    
  const players = [
    CreatePlayer(playerOneName, "X"),
    CreatePlayer(playerTwoName, "O")
  ];

  let activePlayer = players[0]; // set the current player to be "Player One"
  let board = Gameboard;

  // get the #restart button
  const restartBtn = document.getElementById("restart");

  // function for switching player turns
  const switchPlayerTurn = () => {
    // if activePlayer is the first player, switch it to be the second player. else activePlayer will be switched to first player
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  // function for getting the current active player
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.displayBoard();
    // wrap the player's name in a span with a class of the player's marker,
    // so we can change the text's (inside the span) color depending on who's turn it is
    textHolder.innerHTML = `<span class="${getActivePlayer().marker}">${getActivePlayer().name}'s</span> Turn`;
  }

  const checkWinner = () => {
    const gameboard = board.getBoard();
    // if any winning pattern is either "X" or "O" return true
    if (
      gameboard[0] === "X" && gameboard[1] === "X" && gameboard[2] === "X" ||
      gameboard[0] === "X" && gameboard[4] === "X" && gameboard[8] === "X" ||
      gameboard[0] === "X" && gameboard[3] === "X" && gameboard[6] === "X" ||
      gameboard[1] === "X" && gameboard[4] === "X" && gameboard[7] === "X" ||
      gameboard[2] === "X" && gameboard[4] === "X" && gameboard[6] === "X" ||
      gameboard[2] === "X" && gameboard[5] === "X" && gameboard[8] === "X" ||
      gameboard[3] === "X" && gameboard[4] === "X" && gameboard[5] === "X" ||
      gameboard[6] === "X" && gameboard[7] === "X" && gameboard[8] === "X" ||
      gameboard[0] === "O" && gameboard[1] === "O" && gameboard[2] === "O" ||
      gameboard[0] === "O" && gameboard[4] === "O" && gameboard[8] === "O" ||
      gameboard[0] === "O" && gameboard[3] === "O" && gameboard[6] === "O" ||
      gameboard[1] === "O" && gameboard[4] === "O" && gameboard[7] === "O" ||
      gameboard[2] === "O" && gameboard[4] === "O" && gameboard[6] === "O" ||
      gameboard[2] === "O" && gameboard[5] === "O" && gameboard[8] === "O" || 
      gameboard[3] === "O" && gameboard[4] === "O" && gameboard[5] === "O" ||
      gameboard[6] === "O" && gameboard[7] === "O" && gameboard[8] === "O"
    ) return true;
    
    // if all cells in gameboard have been marked and there is no winner
    else if (!(gameboard.includes(""))) {
      return "tie";
    }
  };

  // a function for playing the game
  const playRound = (cell) => {
    if (winnerOrTie === true) return;  // if there is a winner or tie, do nothing

    // else, play a round
    else {
      // if selected cell is already taken, ask to choose another cell and print the board then return nothing
      if (board.makeMove(cell, getActivePlayer().marker) === false) {
        textHolder.textContent = "Please choose another cell";
        return;
      };
      
      // else switch the players and show the updated board
      board.makeMove(cell, getActivePlayer().marker); // this is what updates the board with the players move

      // this is where we should check for a winner and show a message if there is a winner
      if (checkWinner() === true) { // if there is a winner
        // show who won the game then exit the function
        board.displayBoard();
        // change textHolder's innerHTML to display the player who won, with the player's name 
        // wrapped in a span (that has a class of the player's marker)
        textHolder.innerHTML = `<span class="${getActivePlayer().marker}">${getActivePlayer().name}</span> wins!`;
        winnerOrTie = true; // there is a winner so set winnerOrTie to true
        return;

      // else if it's a tie 
      } else if (checkWinner() === "tie") {
        textHolder.textContent = "It's a tie!";
        board.displayBoard();
        winnerOrTie = true; // there is a tie so set winnerOrTie to true\
        return;
      }
  
      switchPlayerTurn(); // this switches the players after making a move
      printNewRound();  // show the updated board and 
      };
  };


  // a function for restarting the game
  const restartGame = () => {
    board.resetBoard(); // reset the board
    activePlayer = players[0]; // set the current player to player 1 (X)
    winnerOrTie = false; // reset winnerOrTie to false
    printNewRound(); // print a new round
  };

  // a function for setting the names of player one and player two
  const setNames = () => {
    // get the values of #player1 and #player2 inputs
    const player1Input = document.querySelector("#player1").value;
    const player2Input = document.querySelector("#player2").value;

    // if player1Input and player2Input are not empty
    if (player1Input !== "" && player2Input !== "") {
      players[0].name = player1Input; // set the first player's name in players to player1Input
      players[1].name = player2Input; // set the second player's name in players to player2Input
      
      // close the dialog and play the game
      document.querySelector("dialog").close();
      document.querySelector(".gameboard").style.visibility = "visible"; // make .gameboard visible
      printNewRound(); // initially print the board and who's turn it is
    }
    return;
  };

  // make #playBtn call setNames() when clicked
  document.querySelector("#playBtn").addEventListener("click", setNames);

  // call restartGame() when restart button is clicked
  restartBtn.addEventListener("click", restartGame);

  return {getActivePlayer, playRound, checkWinner}
})();