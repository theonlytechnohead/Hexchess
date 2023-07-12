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

function createBoard() {
	board = document.getElementsByTagName("board")[0];
	id = 1;
	for (let i = 1; i < 22; i++) {
		row = document.createElement("row");
		if (i < 6)
			n = i;
		else if (i < 17) {
			if (i % 2)
				n = 5;
			else
				n = 6;
		} else {
			n = 22 - i;
		}
		for (let h = 0; h < n; h++) {
			hex = document.createElement("hex");
			p = document.createElement("p");
			hex.appendChild(p);
			id++;
			row.appendChild(hex);
		}
		board.appendChild(row);
	}
}

function setBoard() {
	setPieceRaw(0, 0, blackBishop);
	setPieceRaw(1, 0, blackQueen);
	setPieceRaw(1, 1, blackKing);
	setPieceRaw(2, 0, blackKnight);
	setPieceRaw(2, 1, blackBishop);
	setPieceRaw(2, 2, blackKnight);
	setPieceRaw(3, 0, blackRook);
	setPieceRaw(3, 3, blackRook);
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

	setPieceRaw(20, 0, whiteBishop);
	setPieceRaw(19, 0, whiteQueen);
	setPieceRaw(19, 1, whiteKing);
	setPieceRaw(18, 0, whiteKnight);
	setPieceRaw(18, 1, whiteBishop);
	setPieceRaw(18, 2, whiteKnight);
	setPieceRaw(17, 0, whiteRook);
	setPieceRaw(17, 3, whiteRook);
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