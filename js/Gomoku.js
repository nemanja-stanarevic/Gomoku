
function Gomoku(size, winningLength, strategyMaxDepth) {
  this.size = size;
  
  this.strategy = new Strategy(strategyMaxDepth);
  this.board = new Board(size, winningLength);
 
  this.usersTurn = true;

  this.drawBoard = function(){
	var boardContainer = document.getElementsByClassName("board-container")[0];	
  	var gameContainer = document.getElementsByClassName("game-container")[0];

  	var titleContainer = document.getElementsByClassName("title")[0];
  	titleContainer.innerHTML += ": " + winningLength + " in a row";

	for (var row = 0; row < this.size; row++){
		var newRow = document.createElement("div");
		newRow.classList.add("board-row");

		for (var col = 0; col < this.size; col++) {
			var newCell = document.createElement("div");
			newCell.id = "cell-" + row + "-" + col;
			newCell.classList.add("board-cell");
			newCell.addEventListener("click", this.createClickHandler(this, row, col) );
			newRow.appendChild(newCell);
		}
		boardContainer.appendChild(newRow);
	}
	var sizeStr = (this.size * config.CELL_SIZE)+"px";
	gameContainer.setAttribute("style", "width:"+sizeStr+";height:"+sizeStr);

	var retryButton = document.getElementsByClassName("retry-button")[0];
	retryButton.addEventListener("click", this.createRestartGameHandler(this));
  };

  this.resetBoard = function(){
	for (var row = 0; row < this.size; row++){
		for (var col = 0; col < this.size; col++) {
			var cell = document.getElementById("cell-" + row + "-" + col);
			cell.innerHTML = config.NONE_MARK;
		}
	}
  };

  this.displayMove = function(row, col, mark) {
  	var cell = document.getElementById("cell-"+row+"-"+col);
  	cell.innerHTML = mark;
  };

  this.switchTurn = function () {
  	this.usersTurn = !this.usersTurn;
  };

  this.checkWinningMove = function () {
  	var lastMove = this.board.peekLastMove();
	if (!lastMove)
		return false;

  	var gameOverDiv = document.getElementsByClassName("game-over")[0];
	var gameOverMessage = document.getElementById("game-over-message");
	
	if (this.board.isWinningMove(lastMove)) {
	 	if (lastMove.mark == config.USER_MARK) {
	 		gameOverMessage.innerHTML = config.WON_MESSAGE;
	 	} else {
	 		gameOverMessage.innerHTML = config.LOST_MESSAGE;
	 	} 
	  	gameOverDiv.setAttribute("style", "display: block");
	}
	if (this.board.isFilledout()) {
	  	gameOverMessage.innerHTML = config.DRAW_MESSAGE;
	  	gameOverDiv.setAttribute("style", "display: block");
	}
  };

  this.makeMove = function(row, col, mark) {
		this.board.setValue(row, col, mark);
		this.displayMove(row, col, mark);
		this.checkWinningMove();
		this.switchTurn();
  };

  this.createClickHandler = function(game, row, col){
	var clickHandler = function(e){

		if (!game.usersTurn)
			return;

		var value = game.board.getValue(row, col);

		if (value != "")
			return;

		game.makeMove(row, col, config.USER_MARK);

		setTimeout(game.strategy.getNextMove, 0, game.board, config.ALGO_MARK, function(row, col) { 
				game.makeMove(row, col, config.ALGO_MARK);
	    	} );

	};

	return clickHandler;
  };

  this.createRestartGameHandler = function(game) {
  	var restartHandler = function(e) {
	  	var gameOverDiv = document.getElementsByClassName("game-over")[0];
	  	gameOverDiv.setAttribute("style", "display: none");

		var gameOverMessage = document.getElementById("game-over-message");
	  	gameOverMessage.innerHTML = "";

	  	game.board = new Board(game.board.size, game.board.winningLength);
	  	game.resetBoard();
	  	game.usersTurn = true;
	};

	return restartHandler;
  };

  this.drawBoard();
}

