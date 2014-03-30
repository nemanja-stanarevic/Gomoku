function Strategy(maxDepth) {
	// alphaBetaMemory has a key that is hash of the board
	// value is {upperBound, lowerBound, move}
	this.alphaBetaMemory = {};

	this.maxDepth = maxDepth;


	// returns an array of possible moves 
	function getNextMoves(board, mark) {
	  	var next = [];
		for (var row = 0; row < board.size; row++){
			for (var col = 0; col < board.size; col++) {
				var score = 0;

				// score the moves based on how many moves they have around them 
				// want to try first the moves next to the moves already played
				
				if (board.board[row-1] && board.board[row-1][col+1])
					score += 25;
				if (board.board[row-1] && board.board[row-1][col])
					score += 25;
				if (board.board[row-1] && board.board[row-1][col-1])
					score += 25;
				
				if (board.board[row+1] && board.board[row+1][col+1])
					score += 25;
				if (board.board[row+1] && board.board[row+1][col])
					score += 25;
				if (board.board[row+1] && board.board[row+1][col-1])
					score += 25;
				
				if (board.board[row] && board.board[row][col-1])
					score += 25;
				if (board.board[row] && board.board[row][col+1])
					score += 25;


				if (board.board[row-1] && board.board[row-1][col+1] == mark)
					score += 30;
				if (board.board[row-1] && board.board[row-1][col] == mark)
					score += 30;
				if (board.board[row-1] && board.board[row-1][col-1] == mark)
					score += 30;
				
				if (board.board[row+1] && board.board[row+1][col+1] == mark)
					score += 30;
				if (board.board[row+1] && board.board[row+1][col] == mark)
					score += 30;
				if (board.board[row+1] && board.board[row+1][col-1] == mark)
					score += 30;
				
				if (board.board[row] && board.board[row][col-1] == mark)
					score += 30;
				if (board.board[row] && board.board[row][col+1] == mark)
					score += 30;


				if (board.board[row][col] == "")
					next.push({"row": row, "col": col, "mark": mark, "score":score});

			}
		}	

		return next.sort(function(a,b) {
				if (a.score < b.score)
					return 1;
				if (a.score > b.score)
					return -1;
				return 0;
			}).slice(0, config.STRATEGY_MAX_MOVES);

	};


	function evaluateBoard(board) {
		var lastMove = board.peekLastMove();

		// winning position gets the higherst score
		// but preference is to win in fewer moves
		if (board.isWinningMove(lastMove) && (lastMove.mark == config.USER_MARK)) {
			return board.moves.length - 1000;
		} else if (board.isWinningMove(lastMove) && (lastMove.mark == config.ALGO_MARK)) {
			return 1000 - board.moves.length;
		}

		return 0;
	}

	// takes a pair of {"move", "score"} and returns one with the higher value
	function max(move1, move2) {
		if (move1.score >= move2.score)
			return move1;
		return move2;
	}

	// takes a pair of {"move", "score"} and returns one with the lower value
	function min(move1, move2) {
		if (move1.score <= move2.score)
			return move1;
		return move2;
	}

	// returns minmax value and associated move
	function alphaBetaMax(board, alpha, beta, depth) {

		var lastMove = board.peekLastMove();
		var result = {"score": -Infinity, "move": null};

		if (depth == 0 || board.isFilledout() || board.isWinningMove(lastMove)) {
			result.score = evaluateBoard(board);
		} else {
			var a = alpha;
			var nextMoves = getNextMoves(board, config.ALGO_MARK);
			for (var move = 0, len = nextMoves.length; move < len && result.score < beta; move++) {
				var nextBoard = board.clone(nextMoves[move]);
				result = max(result, {"move": nextMoves[move], "score": alphaBetaMin(nextBoard, a, beta, depth - 1).score});
				a = Math.max(a, result.score);
			}
		}

		return result;
	}

	function alphaBetaMin(board, alpha, beta, depth) {

		var lastMove = board.peekLastMove();
		var result = {"score": +Infinity, "move": null};

		if (depth == 0 || board.isFilledout() || board.isWinningMove(lastMove)) {
			result.score = evaluateBoard(board);
		} else {
			var b = beta;
			var nextMoves = getNextMoves(board, config.USER_MARK);
			for (var move = 0, len = nextMoves.length; move < len && result.score > alpha; move++) {
				var nextBoard = board.clone(nextMoves[move]);
				result = min(result, {"move": nextMoves[move], "score": alphaBetaMax(nextBoard, alpha, b, depth - 1).score});
				b = Math.min(b, result.score);
			}
		}

		return result;
	}


	function alphaBetaSearch(board, depth) {
		var alpha = -Infinity,
			beta = +Infinity;

		return alphaBetaMax(board, alpha, beta, depth);
	}


	this.getNextMove = function(board, mark, callback) {

		var result = alphaBetaSearch(board, maxDepth);


		if (result.move) {
			var row = result.move.row;
			var col = result.move.col;
			

			callback(row, col);
		}
	}
}
