import { NONE, BLACK, WHITE } from "./constants.js";

import {
	whiteKing,
	whiteQueen,
	whiteRook,
	whiteKnight,
	whiteBishop,
	whitePawn,
	whitePawns,
	whitePieces,
	whiteEnds,
} from "./white.js";

import {
	blackKing,
	blackQueen,
	blackRook,
	blackKnight,
	blackBishop,
	blackPawn,
	blackPawns,
	blackPieces,
	blackEnds,
} from "./black.js";

import { getBoard, setNormalBoard } from "./board.js";

// evil JS global scope hack override thingy to make `onclick` work properly
window.play = function play() {
	// if this is the first play session (play button exists)
	if (document.getElementById("play")) {
		// yoink the play button
		document.getElementById("play").remove();
	} else {
		// otherwise, remove the previous board
		getBoard().remove();
	}
	createBoard();
	setNormalBoard();
	// setKingsTest();

	// register user confirmation before exiting
	window.addEventListener("beforeunload", function (e) {
		e.preventDefault();
	});
};

var turn = WHITE;
var checkmated = NONE;

var currentPieces = whitePieces;
var currentKing = whiteKing;
var currentPawn = whitePawn;
var currentPawns = whitePawns;
var otherPieces = blackPieces;
var otherKing = blackKing;
var otherPawn = blackPawn;
var otherPawns = blackPawns;

var selectedRow = null;
var selectedColumn = null;

var possible = [];

function createBoard() {
	let pulse = document.createElement("pulse");
	document.getElementsByTagName("main")[0].appendChild(pulse);
	setTimeout(() => {
		pulse.remove();
	}, 1000);
	let board = document.createElement("board");
	document.body.onclick = (e) => {
		deselect();
	};
	for (let r = 1; r < 22; r++) {
		let row = document.createElement("row");
		if (r < 6) {
			var n = r;
			var m = Math.min(4 - n + ((r + 1) % 2), 2);
		} else if (r < 17) {
			if (r % 2) var n = 5;
			else var n = 6;
			var m = 0;
		} else {
			var n = 22 - r;
			var m = Math.min(4 - n + ((r + 1) % 2), 2);
		}

		for (let h = 0; h < 6 - (r % 2); h++) {
			let hex = document.createElement("hex");
			if (h < m) {
				hex.classList.add("disabled");
			} else if (m <= h && h < 6 - m - (r % 2)) {
				switch (r % 3) {
					case 0:
						hex.classList.add("tile1");
						break;
					case 1:
						hex.classList.add("tile2");
						break;
					case 2:
						hex.classList.add("tile3");
						break;
				}
				hex.onclick = (e) => {
					if (selectSquare(r - 1, h)) showPossible(r - 1, h);
					// event is handled, stop propagation now
					e.stopPropagation();
					return false;
				};
			} else {
				hex.classList.add("disabled");
			}
			let p = document.createElement("p");
			hex.appendChild(p);
			row.appendChild(hex);
		}
		board.appendChild(row);
	}
	document.getElementsByTagName("main")[0].appendChild(board);
}

function deselect() {
	applyHighlight();
	possible.length = 0;
	let board = getBoard();
	if (selectedRow != null && selectedColumn != null) {
		let r = board.children[selectedRow];
		let h = r.children[selectedColumn];
		h.classList.remove("selected");
		selectedRow = null;
		selectedColumn = null;
	}
}

function changeTurn() {
	turn = (turn + 1) % 2;
	// spin the board!
	let board = getBoard();
	switch (turn) {
		case WHITE:
			board.classList.remove("flipped");
			break;
		case BLACK:
			board.classList.add("flipped");
			break;
	}
	currentPieces = turn ? blackPieces : whitePieces;
	currentKing = turn ? blackKing : whiteKing;
	currentPawn = turn ? blackPawn : whitePawn;
	currentPawns = turn ? blackPawns : whitePawns;
	otherPieces = turn ? whitePieces : blackPieces;
	otherKing = turn ? whiteKing : blackKing;
	otherPawn = turn ? whitePawn : blackPawn;
	otherPawns = turn ? whitePawns : blackPawns;

	// check for checkmate
	// testCheckmate();
}

// function testCheckmate() {
// 	// search for a check
// 	let board = getBoard();
// 	for (var i = 0; i < board.children.length; i++) {
// 		var row = board.children[i];
// 		for (var j = 0; j < row.children.length; j++) {
// 			var hex = row.children[j];
// 			// if the king is in check
// 			if (hex.classList.contains("check")) {
// 				console.log(hex.children[0].innerText);
// 				// and has nowhere to move
// 				var moves = getPossible(i, j);
// 				console.log(moves);
// 				if (moves.length == 0) {
// 					// trigger checkmate
// 					console.log("checkmate?")
// 				}
// 			}
// 		}
// 	}
// }

function choices(row, column) {
	let choose = document.createElement("choose");
	var pieces = null;
	switch (turn) {
		case WHITE:
			pieces = [whiteQueen, whiteRook, whiteKnight, whiteBishop];
			break;
		case BLACK:
			pieces = [blackQueen, blackRook, blackKnight, blackBishop];
			break;
	}
	pieces.forEach((piece) => {
		let p = document.createElement("p");
		switch (turn) {
			case WHITE:
				p.classList.add("white");
				break;
			case BLACK:
				p.classList.add("black");
				break;
		}
		p.onclick = () => {
			choose.remove();
			playMove(row, column, piece);
		};
		p.textContent = piece;
		choose.appendChild(p);
	});
	document.getElementsByTagName("main")[0].appendChild(choose);
}

function move(fromRow, fromColumn, toRow, toColumn) {
	let board = getBoard();
	let r = board.children[fromRow];
	let h = r.children[fromColumn];
	let p = h.children[0];
	switch (turn) {
		case WHITE:
			p.classList.remove("white");
			break;
		case BLACK:
			p.classList.remove("black");
			break;
	}
	let piece = p.textContent;
	// clear piece
	p.textContent = "";
	if (piece == currentKing) {
		h.classList.remove("check");
	}
	if (piece === currentPawn) {
		let moves = en_passant(fromRow, fromColumn);
		if (moves.length) {
			moves.forEach((move) => {
				if (move[0] === toRow && move[1] === toColumn) {
					console.log("you shall not pass!");
					switch (turn) {
						case WHITE:
							var row = +2;
							break;
						case BLACK:
							var row = -2;
							break;
					}
					r = board.children[toRow + row];
					h = r.children[toColumn];
					p = h.children[0];
					switch (turn) {
						case WHITE:
							p.classList.remove("black");
							break;
						case BLACK:
							p.classList.remove("white");
							break;
					}
					// en passant
					p.textContent = "";
				}
			});
		}
	}

	if (piece === currentPawn) {
		switch (turn) {
			case WHITE:
				var endTiles = blackEnds;
				break;
			case BLACK:
				var endTiles = whiteEnds;
				break;
		}
		let end = endTiles.filter((position) => {
			return position[0] === toRow && position[1] === toColumn;
		});
		if (end.length) {
			choices(toRow, toColumn);
			return;
		}
	}
	playMove(toRow, toColumn, piece);
}

function playMove(toRow, toColumn, piece) {
	let board = getBoard();
	let r = board.children[toRow];
	let h = r.children[toColumn];
	let p = h.children[0];
	switch (turn) {
		case WHITE:
			p.classList.remove("black");
			p.classList.add("white");
			break;
		case BLACK:
			p.classList.remove("white");
			p.classList.add("black");
			break;
	}
	if (p.textContent == otherKing) {
		// trigger checkmate
		checkmate(toRow, toColumn);
	}

	p.textContent = piece;

	if (checkmated == NONE) {
		// TODO: check if this player can attack the opposing king?
		setCheck();
		changeTurn();
	} else {
		displayCheckmate();
	}
}

function setCheck() {
	let board = getBoard();
	var attacking = getAttacking(currentPieces);
	attacking.forEach((coordinate) => {
		let r = board.children[coordinate[0]];
		let h = r.children[coordinate[1]];
		let p = h.children[0];
		if (p.textContent == otherKing) {
			h.classList.add("check");
		}
	});
}

function checkmate(row, column) {
	console.log("checkmate!");
	checkmated = turn;
	let board = getBoard();
	let r = board.children[row];
	let h = r.children[column];
	h.classList.add("check");
}

function displayCheckmate() {
	let checkmate = document.createElement("checkmate");

	let h1 = document.createElement("h1");
	h1.innerText = "Checkmate";
	checkmate.appendChild(h1);

	let h2 = document.createElement("h2");
	switch (checkmated) {
		case WHITE:
			h2.innerText = "White wins!";
			break;
		case BLACK:
			h2.innerText = "Black wins!";
			break;
	}
	checkmate.appendChild(h2);

	let dismiss = document.createElement("button");
	dismiss.innerText = "Dismiss";
	dismiss.onclick = () => {
		checkmate.remove();
	};
	checkmate.appendChild(dismiss);

	let again = document.createElement("button");
	again.innerText = "Play again";
	again.onclick = () => {
		checkmate.remove();
		checkmated = NONE;
		turn = WHITE;
		play();
	};
	checkmate.appendChild(again);

	document.getElementsByTagName("main")[0].appendChild(checkmate);
}

function getAttacking(pieces) {
	let board = getBoard();
	var attacking = [];
	for (let r = 0; r < board.children.length; r++) {
		let row = board.children[r];
		for (let h = 0; h < row.children.length; h++) {
			let hex = row.children[h];
			let p = hex.children[0];
			if (pieces.includes(p.textContent)) {
				attacking.push(...getPossible(r, h));
			}
		}
	}
	return attacking;
}

function selectSquare(row, column) {
	if (checkmated != NONE) return false;
	let board = getBoard();
	let r = board.children[row];
	let h = r.children[column];
	if (h.classList.contains("possible")) {
		move(selectedRow, selectedColumn, row, column);
		deselect();
		return false;
	}
	deselect();
	let p = h.children[0];
	let piece = p.textContent;
	if (currentPieces.includes(piece)) {
		selectedRow = row;
		selectedColumn = column;
		h.classList.add("selected");
		return true;
	}
	return false;
}

function highlight(row, column) {
	let board = getBoard();
	let r = board.children[row];
	let h = r.children[column];
	h.classList.toggle("possible");
}

function applyHighlight() {
	possible.forEach((element) => {
		highlight(element[0], element[1]);
	});
}

function en_passant(row, column) {
	switch (turn) {
		case WHITE:
			var one = +1;
			var two = +2;
			var four = +4;
			break;
		case BLACK:
			var one = -1;
			var two = -2;
			var four = -4;
			break;
	}
	let board = getBoard();
	let possible = [];
	let offset = row % 2;
	// en passant left up
	let en_passant = otherPawns.filter((position) => {
		return position[0] + two === row - one && position[1] === column - offset;
	});
	if (en_passant.length) {
		let taking = [en_passant[0][0] + four, en_passant[0][1]];
		let r = board.children[taking[0]];
		let h = r.children[taking[1]];
		let p = h.children[0];
		let piece = p.textContent;
		if (piece === otherPawn) {
			let moving = [en_passant[0][0] + two, en_passant[0][1]];
			possible.push(moving);
		}
	}
	// en passant right up
	offset = row % 2 == 0;
	en_passant = otherPawns.filter((position) => {
		return position[0] + two === row - one && position[1] === column + offset;
	});
	if (en_passant.length) {
		let taking = [en_passant[0][0] + four, en_passant[0][1]];
		let r = board.children[taking[0]];
		let h = r.children[taking[1]];
		let p = h.children[0];
		let piece = p.textContent;
		if (piece === otherPawn) {
			let moving = [en_passant[0][0] + two, en_passant[0][1]];
			possible.push(moving);
		}
	}
	return possible;
}

function showPossible(row, column) {
	applyHighlight();
	possible = getPossible(row, column);
	applyHighlight();
}

function getPossible(row, column) {
	var possible = [];
	let board = getBoard();
	let r = board.children[row];
	let h = r.children[column];
	let p = h.children[0];
	let piece = p.textContent;

	let needsFilter = false;
	let offset = row % 2;
	let currentRow;
	let currentColumn;
	let end = false;
	switch (piece) {
		case whitePawn:
			// starting row (white)
			if (
				currentPawns.filter((position) => {
					return position[0] === row && position[1] === column;
				}).length
			) {
				r = board.children[row - 2];
				h = r.children[column];
				p = h.children[0];
				piece = p.textContent;
				if (piece === "") {
					r = board.children[row - 4];
					h = r.children[column];
					p = h.children[0];
					piece = p.textContent;
					if (piece === "") possible.push([row - 4, column]);
				}
			}
			// take left up
			r = board.children[row - 1];
			h = r.children[column - offset];
			if (h != undefined) {
				p = h.children[0];
				piece = p.textContent;
				if (otherPieces.includes(piece)) possible.push([row - 1, column - offset]);
			}
			// take right up
			offset = row % 2 == 0;
			r = board.children[row - 1];
			h = r.children[column + offset];
			if (h != undefined) {
				p = h.children[0];
				piece = p.textContent;
				if (otherPieces.includes(piece)) possible.push([row - 1, column + offset]);
				possible = possible.concat(en_passant(row, column));
			}
			// forward
			r = board.children[row - 2];
			h = r.children[column];
			p = h.children[0];
			piece = p.textContent;
			if (piece === "") possible.push([row - 2, column]);
			needsFilter = true;
			break;
		case blackPawn:
			// starting row (white)
			if (
				currentPawns.filter((position) => {
					return position[0] === row && position[1] === column;
				}).length
			) {
				r = board.children[row + 2];
				h = r.children[column];
				p = h.children[0];
				piece = p.textContent;
				if (piece === "") {
					r = board.children[row + 4];
					h = r.children[column];
					p = h.children[0];
					piece = p.textContent;
					if (piece === "") possible.push([row + 4, column]);
				}
			}
			// take left up
			r = board.children[row + 1];
			h = r.children[column - offset];
			if (h != undefined) {
				p = h.children[0];
				piece = p.textContent;
				if (otherPieces.includes(piece)) possible.push([row + 1, column - offset]);
			}
			// take right up
			offset = row % 2 == 0;
			r = board.children[row + 1];
			h = r.children[column + offset];
			if (h != undefined) {
				p = h.children[0];
				piece = p.textContent;
				if (otherPieces.includes(piece)) possible.push([row + 1, column + offset]);
				possible = possible.concat(en_passant(row, column));
			}
			// forward
			r = board.children[row + 2];
			h = r.children[column];
			p = h.children[0];
			piece = p.textContent;
			if (piece === "") possible.push([row + 2, column]);
			needsFilter = true;
			break;
		case whiteKing:
		case blackKing:
			// TODO: test for check/checkmate?
			// forward
			possible.push([row - 2, column]);
			// left
			possible.push([row, column - 1]);
			// left up
			possible.push([row - 1, column - offset]);
			// forward left
			possible.push([row - 3, column - offset]);
			// right
			possible.push([row, column + 1]);
			// right up
			possible.push([row - 1, column + 1 - offset]);
			// forward right
			possible.push([row - 3, column + 1 - offset]);
			// left down
			possible.push([row + 1, column - offset]);
			// backward left
			possible.push([row + 3, column - offset]);
			// right down
			possible.push([row + 3, column + 1 - offset]);
			// backward right
			possible.push([row + 1, column + 1 - offset]);
			// backward
			possible.push([row + 2, column]);
			needsFilter = true;
			break;
		case whiteKnight:
		case blackKnight:
			// forward
			possible.push([row - 5, column - offset]);
			possible.push([row - 5, column + 1 - offset]);
			// forward left
			possible.push([row - 4, column - 1]);
			possible.push([row - 1, column - 1 - offset]);
			// forward right
			possible.push([row - 4, column + 1]);
			possible.push([row - 1, column + 2 - offset]);
			// backward left
			possible.push([row + 1, column - 1 - offset]);
			possible.push([row + 4, column - 1]);
			// backward right
			possible.push([row + 1, column + 2 - offset]);
			possible.push([row + 4, column + 1]);
			// backward
			possible.push([row + 5, column - offset]);
			possible.push([row + 5, column + 1 - offset]);
			needsFilter = true;
			break;
		case whiteRook:
		case blackRook:
			// forward
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentRow -= 2;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow -= 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow += 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// backward
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentRow += 2;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow >= 19;
			} while (!end);
			break;
		case whiteBishop:
		case blackBishop:
			// left
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentColumn -= 1;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow >= 19 || currentColumn <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow -= 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentColumn += 1;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset >= 5;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow += 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn >= 6 - offset;
			} while (!end);
			break;
		case whiteQueen:
		case blackQueen:
			// rook-like
			// forward
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentRow -= 2;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow -= 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow += 1;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 1;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// backward
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentRow += 2;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow >= 19;
			} while (!end);
			// bishop-like
			// left
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				currentColumn -= 1;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end = piece !== "" || otherPieces.includes(piece) || currentRow >= 19 || currentColumn <= 0;
			} while (!end);
			// left up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow -= 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentColumn += 1;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn + offset >= 5;
			} while (!end);
			// right up
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow -= 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 19 ||
					currentColumn >= 6 - offset;
			} while (!end);
			// left down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2;
				currentRow += 3;
				currentColumn -= offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn + offset <= 0;
			} while (!end);
			// right down
			currentRow = row;
			currentColumn = column;
			end = false;
			do {
				offset = currentRow % 2 == 0;
				currentRow += 3;
				currentColumn += offset;
				r = board.children[currentRow];
				if (r == undefined) break;
				h = r.children[currentColumn];
				if (h == undefined) break;
				p = h.children[0];
				piece = p.textContent;
				if (currentPieces.includes(piece)) break;
				possible.push([currentRow, currentColumn]);
				end =
					piece !== "" ||
					otherPieces.includes(piece) ||
					currentRow >= 18 ||
					currentColumn >= 6 - offset;
			} while (!end);
			break;
	}
	// filter invalid moves
	function isValid(value, index, array) {
		let row = value[0];
		let column = value[1];
		let r = board.children[row];
		if (r == undefined) return false;
		let h = r.children[column];
		if (h == undefined) return false;
		let p = h.children[0];
		let piece = p.textContent;
		if (currentPieces.includes(piece)) return false;
		return true;
	}
	if (needsFilter) {
		possible = possible.filter(isValid);
	}
	// filter king-safe moves
	// this is still a bit broken
	// function kingSafe(value, index, array) {
	// 	for (const element of attacked) {
	// 		if (value[0] === element[0] && value[1] === element[1]) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }
	// if (piece == currentKing) {
	// 	// test for checkmate, and/or stalemate
	// 	var attacked = getAttacking(otherPieces);
	// 	possible = possible.filter(kingSafe);
	// 	if (possible.length == 0) {
	// 		// TODO: test for check
	// 		// TODO: test for stalemate
	// 	}
	// }
	return possible;
}
