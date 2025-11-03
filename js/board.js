import {
	whiteKing,
	whiteQueen,
	whiteRook,
	whiteKnight,
	whiteBishop,
	whitePawn,
	whitePieces,
} from "./white.js";

import {
	blackKing,
	blackQueen,
	blackRook,
	blackKnight,
	blackBishop,
	blackPawn,
	blackPieces,
} from "./black.js";

export function getBoard() {
	return document.getElementsByTagName("board")[0];
}

function setPieceRaw(row, column, piece) {
	let board = getBoard();
	let r = board.children[row];
	let h = r.children[column];
	let p = h.children[0];
	p.textContent = piece;
	if (blackPieces.includes(piece)) p.classList.add("black");
	else if (whitePieces.includes(piece)) p.classList.add("white");
}

export function setNormalBoard() {
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

export function setKingsTest() {
	setPieceRaw(19, 2, whiteQueen);
	setPieceRaw(1, 3, blackKing);
}
