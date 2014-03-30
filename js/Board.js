function Board(size, winningLength) {
	this.size = size;
	this.winningLength = winningLength;

	this.board = new Array(this.size);
	for (var row = 0; row < this.size; row++){
		this.board[row] = new Array(this.size);
		for (var col = 0; col < this.size; col++) {
			this.board[row][col] = config.NONE_MARK;
		}
	}

	// log of all moves played on the board
	this.moves = [];

	this.getValue = function(row, col){
		return this.board[row][col];
	};

	this.setValue = function(row, col, mark){
		this.board[row][col] = mark;
		this.moves.push({"row": row, "col": col, "mark": mark})
	};

	this.peekLastMove = function () {
		if (this.moves.length == 0)
			return null;

		return this.moves[this.moves.length - 1];
	};

	// checks if the move is the winning move
	// lastMove is an object with "row", "col", and "mark" properties
	this.isWinningMove = function(lastMove){

		var directions = ["N", "S", "E", "W", "NW", "NE", "SE", "SW"];
		var counter = {"N": 0, "S": 0, "E": 0, "W": 0, "NW": 0, "NE": 0, "SE": 0, "SW":0};
		var multiplier = {"N": {"row":-1, "col":0}, "S": {"row":1, "col":0}, 
						  "E": {"row":0, "col":1}, "W": {"row":0, "col":-1}, 
						  "NW": {"row":-1, "col":-1}, "NE": {"row":-1, "col":1}, 
						  "SE": {"row":1, "col":1}, "SW": {"row":1, "col":-1} };

		for (var directionIndex in directions) {
			var direction = directions[directionIndex];
			for (var offset = 1; offset < this.winningLength; offset++) {
				row = lastMove.row + multiplier[direction]["row"] * offset;
				col = lastMove.col + multiplier[direction]["col"] * offset;

				if (this.board[row]===undefined || this.board[row][col]===undefined)
					break;

				if (this.board[row][col] != lastMove.mark)
					break;

				counter[direction]++;
			}
		}

		var NorthSouth = 1 + counter["N"] + counter["S"];
		var WestEast = 1 + counter["W"] + counter["E"];
		var NorthWestSouthEast = 1 + counter["NW"] + counter["SE"];
		var NorthEastSouthWest = 1 + counter["NE"] + counter["SW"];

		return (NorthSouth >= this.winningLength) || (WestEast >= this.winningLength) ||
			   (NorthWestSouthEast >= this.winningLength) || (NorthEastSouthWest >= this.winningLength);
	}

	// check if the board is filled
	this.isFilledout = function() {
		return this.moves.length == this.size * this.size;
	};

	// return a copy of this board with an additional move
	// nextMove is an object with "row", "col", and "mark" properties
	this.clone = function(nextMove) {
		var newBoard = new Board(this.size, this.winningLength);
		for (var move in this.moves) {
			newBoard.setValue(this.moves[move].row, this.moves[move].col, this.moves[move].mark)
		}
		newBoard.setValue(nextMove.row, nextMove.col, nextMove.mark)
		return newBoard;
	}


	this.toString = function() {
		return this.board.toString();
	};
}


