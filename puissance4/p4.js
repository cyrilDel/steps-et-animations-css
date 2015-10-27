window.onload = function () {
	var model = {
		A: [], B: [], C: [], D: [], E: [], F: [], G: [], // grid columns
		
		currentPlayer: 1,
		nextPlayer: 2,
		
		gameOver: false,
		
		dropPawn: function(col) {
			if(this[col].length < 6) {			
				var cell = col + this[col].length;
				view.displayPawn(cell);
				this[col].push(this.currentPlayer);
				
				if(this.checkVictory(col, this[col].length - 1)) {
					this.gameOver = true;
					
					return "Joueur " + this.currentPlayer + " a gagné !";
				} else {
					return "Joueur " + this.nextPlayer + ", c'est à ton tour !";
				}
			}
		},

		checkVictory: function(lastDropCol, lastDropPos) {
			var cols = ["A", "B", "C", "D", "E", "F", "G"];
			
			// check vertical alignment
			var pawn = 1;
			var pos = lastDropPos;
			for (var i = 0; i < 4; i++) {
				 pos--;
				 if(model[lastDropCol][pos] === this.currentPlayer) {
					pawn++;
				 } else {
					i = 4;
				 }
			}
			
			// check horizontal alignment
			if(pawn != 4) {
				pawn = 1;
				var col = lastDropCol;
				var colIndex = cols.indexOf(lastDropCol);
				var maxRight = cols.length - colIndex - 1;
				var maxLeft = cols.length - maxRight - 1;
				
				for (var i = 0; i < maxRight; i++) {
					colIndex++;
					col = cols[colIndex];
					if(model[col][lastDropPos] === this.currentPlayer) {
						pawn++;
					} else {
						i = maxRight;
					}
				}
				
				var colIndex = cols.indexOf(lastDropCol);
				for (var i = 0; i < maxLeft; i++) {
					colIndex--;
					col = cols[colIndex];
					if(model[col][lastDropPos] === this.currentPlayer) {
						pawn++;
					} else {
						i = maxLeft;
					}
				}
			}
			
			// check diagonal alignment
			for (var d = 0; d < 2; d++) {
				if(pawn != 4) {
					pawn = 1;
					var col = lastDropCol;
					var colIndex = cols.indexOf(lastDropCol);
					var maxRight = cols.length - colIndex - 1;
					var maxLeft = cols.length - maxRight - 1;
					var pos = lastDropPos;
					
					for (var i = 0; i < maxRight; i++) {
						colIndex++;
						col = cols[colIndex];
						if(d === 0) { pos++; } else { pos--; } // switch between bottom to top / top to bottom checking
						if(model[col][pos] === this.currentPlayer) {
							pawn++;
						} else {
							i = maxRight;
						}
					}
					
					var colIndex = cols.indexOf(lastDropCol);
					var pos = lastDropPos;
					for (var i = 0; i < maxLeft; i++) {
						colIndex--;
						col = cols[colIndex];
						if(d === 0) { pos--; } else { pos++; } // switch between bottom to top / top to bottom checking
						if(model[col][pos] === this.currentPlayer) {
							pawn++;
						} else {
							i = maxLeft;
						}
					}
				}
			}
		
			if(pawn === 4) {
				return true;
			} else {
				return false;
			}
		},
		
		nextRound: function() {
			this.nextPlayer = this.currentPlayer;
			if(this.currentPlayer === 1) { this.currentPlayer = 2; } else { this.currentPlayer = 1; }
		}
	}; 


	var view = {
		displayPawn: function(location) {
			var newPawn = document.getElementById(location);
			newPawn.innerHTML = '<div class="p'+model.currentPlayer+'"></div>';
		}
	}; 


	var controller = {
		play: function(thisCol) {
			if(!model.gameOver) {
				var col = thisCol.getAttribute("id");
				var status = model.dropPawn(col);
				if (status) {
					document.getElementById("status").innerHTML = status;
				}
				
				model.nextRound();
			}
		}
	}

	/* init */
	model.currentPlayer = Math.floor(Math.random() * 2) + 1;
	if(model.currentPlayer === 1) {
		model.nextPlayer = 2;
	} else {
		model.nextPlayer = 1;
	}
	document.getElementById("status").innerHTML = "Joueur " + model.currentPlayer + ", c'est à toi de commencer !";

	var element = document.getElementsByClassName("col");
	for (var i = 0; i < element.length; i++) {
		element[i].addEventListener('click', function() { controller.play(this); }, false);
	}
};
