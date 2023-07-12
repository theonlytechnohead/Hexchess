window.onload = () => {
	createBoard();
	setBoard();
};

const whiteKing = "♔";
const whiteQueen = "♕";
const whiteRook = "♖";
const whiteBishop = "♗";
const whiteKnight = "♘";
const whitePawn = "♙";
const whitePieces = [whiteKing, whiteQueen, whiteRook, whiteBishop, whiteKnight, whitePawn];

const blackKing = "♚";
const blackQueen = "♛";
const blackRook = "♜";
const blackBishop = "♝";
const blackKnight = "♞";
const blackPawn = "♟︎";
const blackPieces = [blackKing, blackQueen, blackRook, blackBishop, blackKnight, blackPawn];


var selectedRow = null;
var selectedColumn = null;

var possible = [];

function createBoard() {
	board = document.getElementsByTagName("board")[0];
	document.body.onclick = (e) => {
		deselect();
	}
	for (let r = 1; r < 22; r++) {
		row = document.createElement("row");
		if (r < 6) {
			n = r;
			m = Math.min(4 - n + (r + 1) % 2, 2);
		} else if (r < 17) {
			if (r % 2)
				n = 5;
			else
				n = 6;
			m = 0;
		} else {
			n = 22 - r;
			m = Math.min(4 - n + (r + 1) % 2, 2);
		}

		for (let h = 0; h < 6 - r % 2; h++) {
			hex = document.createElement("hex");
			if (h < m) {
				hex.classList.add("disabled");
			} else if (m <= h && h < 6 - m - r % 2) {
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
					if (selectSquare(r - 1, h))
						showPossible(r - 1, h);
					// event is handled, stop propagation now
					var evt = e ? e : window.event;
					if (evt.stopPropagation) { evt.stopPropagation(); }
					else { evt.cancelBubble = true; }
					return false;
				};
			} else {
				hex.classList.add("disabled");
			}
			p = document.createElement("p");
			hex.appendChild(p);
			row.appendChild(hex);
		}
		board.appendChild(row);
	}
}

function setBoard() {
	setPieceRaw(0, 2, blackBishop);
	setPieceRaw(1, 2, blackQueen);
	setPieceRaw(1, 3, blackKing);
	setPieceRaw(2, 1, blackKnight);
	setPieceRaw(2, 2, blackBishop);
	setPieceRaw(2, 3, blackKnight);
	setPieceRaw(3, 1, blackRook);
	setPieceRaw(3, 4, blackRook);
	setPieceRaw(4, 2, blackBishop);
	setPieceRaw(4, 0, blackPawn);
	setPieceRaw(4, 4, blackPawn);
	setPieceRaw(5, 1, blackPawn);
	setPieceRaw(5, 4, blackPawn);
	setPieceRaw(6, 1, blackPawn);
	setPieceRaw(6, 3, blackPawn);
	setPieceRaw(7, 2, blackPawn);
	setPieceRaw(7, 3, blackPawn);
	setPieceRaw(8, 2, blackPawn);

	setPieceRaw(20, 2, whiteBishop);
	setPieceRaw(19, 2, whiteQueen);
	setPieceRaw(19, 3, whiteKing);
	setPieceRaw(18, 1, whiteKnight);
	setPieceRaw(18, 2, whiteBishop);
	setPieceRaw(18, 3, whiteKnight);
	setPieceRaw(17, 1, whiteRook);
	setPieceRaw(17, 4, whiteRook);
	setPieceRaw(16, 2, whiteBishop);
	setPieceRaw(16, 0, whitePawn);
	setPieceRaw(16, 4, whitePawn);
	setPieceRaw(15, 1, whitePawn);
	setPieceRaw(15, 4, whitePawn);
	setPieceRaw(14, 1, whitePawn);
	setPieceRaw(14, 3, whitePawn);
	setPieceRaw(13, 2, whitePawn);
	setPieceRaw(13, 3, whitePawn);
	setPieceRaw(12, 2, whitePawn);
}


function setPieceRaw(row, column, piece) {
	board = document.getElementsByTagName("board")[0];
	r = board.children[row];
	h = r.children[column];
	p = h.children[0];
	p.textContent = piece;
	if (blackPieces.includes(piece))
		p.classList.add("black");
	else if (whitePieces.includes(piece))
		p.classList.add("white");
}


function deselect() {
	applyHighlight();
	possible = [];
	board = document.getElementsByTagName("board")[0];
	if (selectedRow != null && selectedColumn != null) {
		r = board.children[selectedRow];
		h = r.children[selectedColumn];
		h.classList.remove("selected")
		selectedRow = null;
		selectedColumn = null;
	}
}

function selectSquare(row, column) {
	board = document.getElementsByTagName("board")[0];
	deselect();
	r = board.children[row];
	h = r.children[column];
	p = h.children[0];
	piece = p.textContent;
	if (whitePieces.includes(piece)) {
		selectedRow = row;
		selectedColumn = column;
		h.classList.add("selected")
		return true;
	}
	return false;
}

function highlight(row, column) {
	board = document.getElementsByTagName("board")[0];
	r = board.children[row];
	if (r == undefined)
		return;
	h = r.children[column];
	if (h == undefined)
		return;
	if (!whitePieces.includes(h.innerText))
		h.classList.toggle("possible");
}

function applyHighlight() {
	possible.forEach(element => {
		highlight(element[0], element[1]);
	});
}

function showPossible(row, column) {
	applyHighlight();
	possible = [];
	board = document.getElementsByTagName("board")[0];
	r = board.children[row];
	h = r.children[column];
	p = h.children[0];
	piece = p.textContent;

	offset = row % 2;
	switch (piece) {
		case whitePawn:
			// starting row (white)
			if (11 < row && row < 17) {
				possible.push([row - 4, column]);
			}
			possible.push([row - 2, column]);
			break;
		case whiteKing:
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
			break;
		case whiteKnight:
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
			break;
		default:
			break;
	}
	applyHighlight();
}