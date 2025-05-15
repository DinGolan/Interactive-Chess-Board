/****************************/
/* Exercise 2 - Chess Board */
/****************************/
'use strict';

// Const Variables //
const PAWN_BLACK   = '♟';
const ROOK_BLACK   = '♜';
const KNIGHT_BLACK = '♞';
const BISHOP_BLACK = '♝';
const QUEEN_BLACK  = '♛';
const KING_BLACK   = '♚';
const PAWN_WHITE   = '♙';
const ROOK_WHITE   = '♖';
const KNIGHT_WHITE = '♘';
const BISHOP_WHITE = '♗';
const QUEEN_WHITE  = '♕';
const KING_WHITE   = '♔';

// Global Variables //
var gBoard          = undefined;
var gSelectedElCell = null;

// Functions //
function onRestartGame() {
    gSelectedElCell = null;
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    const board  = [];
    const LENGTH = 8;

    for (let i = 0; i < LENGTH; i++) {
        board[i] = [];
        for (let j = 0; j < LENGTH; j++) {
            board[i][j] = '';

            if (i === 1) board[i][j] = PAWN_BLACK;
            if (i === 6) board[i][j] = PAWN_WHITE;
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    return board;
}

function renderBoard(gBoard) {
    let strHTML = '';

    for (let i = 0; i < gBoard.length; i++) {
        const row = gBoard[i];
        strHTML  += '<tr>';

        for (let j = 0; j < row.length; j++) {
            const cell    = row[j];
            let className = ((i + j) % 2 === 0) ? 'white' : 'black';
            const tdId    = `cell-${i}-${j}`;
            strHTML      += `<td id="${tdId}" 
                                 onclick="onCellClicked(this)"
                                 class="${className}" 
                                 title="${getCellName(cell)}">
                                 ${cell}
                            </td>`; 
        }

        strHTML += '</tr>';
    }

    const elMat     = document.querySelector('.game-board');
    elMat.innerHTML = strHTML; 
}

function onCellClicked(elCell) {
    // Move Piece on Board //
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return;
    }

    cleanBoard();

    elCell.classList.add('selected');

    gSelectedElCell = elCell; // Saving in global variable the previous cell //

    // Option - 1 //
    const cellCoord = getCellCoord(elCell.id);
    const piece     = gBoard[cellCoord.i][cellCoord.j];

    // Option - 2 //
    /* const piece = elCell.innerText; */

    let possibleCoords = [];

    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;

        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        
        case PAWN_BLACK:
        case PAWN_WHITE:
            const isPawnWhite = piece === PAWN_WHITE;
            possibleCoords    = getAllPossibleCoordsPawn(cellCoord, isPawnWhite);
            break;

        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;

        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;
    }

    markCells(possibleCoords);
}

function getCellName(cell) {
    switch (cell) {
        case PAWN_BLACK:
        case PAWN_WHITE:
            return 'Pawn';
        case ROOK_BLACK:
        case ROOK_WHITE:
            return 'Rook';
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            return 'Knight';
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            return 'Bishop';
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            return 'Queen';
        case KING_BLACK:
        case KING_WHITE:
            return 'King';
        default:
            return '';
    }
}

function movePiece(elFromCell, elToCell) {
    // Update the Model //
    let fromCoord = getCellCoord(elFromCell.id);
    let toCoord   = getCellCoord(elToCell.id);

    let piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j]     = piece;

    // Update the DOM //
    elFromCell.innerText = '';
    elToCell.innerText   = piece;
}

function cleanBoard() {
    const elTds = document.querySelectorAll('.mark, .selected');
    for (let i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getCellCoord(strCellId) {
    const coord = { };
    const parts = strCellId.split('-');
    coord.i     = +parts[1];
    coord.j     = +parts[2];
    return coord;
}

function isCellWhite(coord) {
    /**
     * Details :
     * > True  ---> The cell is white.
     * > False ---> The cell is black.
     **/
    let currCell = gBoard[coord.i][coord.j];
    return currCell === PAWN_WHITE   ||
           currCell === ROOK_WHITE   ||
           currCell === KNIGHT_WHITE ||
           currCell === BISHOP_WHITE ||
           currCell === QUEEN_WHITE  ||
           currCell === KING_WHITE;
}

function getMovesUp(pieceCoord, isPieceWhite) {
    let res = [];

    for (let i = pieceCoord.i - 1; i >= 0; i--) {
        let currCell  = gBoard[i][pieceCoord.j];
        let currCoord = { i: i, j: pieceCoord.j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesDown(pieceCoord, isPieceWhite, rows) {
    let res = [];

    for (let i = pieceCoord.i + 1; i < rows; i++) {
        let currCell  = gBoard[i][pieceCoord.j];
        let currCoord = { i: i, j: pieceCoord.j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesLeft(pieceCoord, isPieceWhite) {
    let res = [];

    for (let j = pieceCoord.j - 1; j >= 0; j--) {
        let currCell  = gBoard[pieceCoord.i][j];
        let currCoord = { i: pieceCoord.i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesRight(pieceCoord, isPieceWhite, cols) {
    let res = [];

    for (let j = pieceCoord.j + 1; j < cols; j++) {
        let currCell  = gBoard[pieceCoord.i][j];
        let currCoord = { i: pieceCoord.i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getAllPossibleCoordsRook(pieceCoord) {
    let res    = [];
    const rows = gBoard.length;
    const cols = gBoard[0].length;
    const isPieceWhite = isCellWhite(pieceCoord);
    
    // Down → Up //
    res.push(...getMovesUp(pieceCoord, 
                           isPieceWhite));

    // Up → Down //
    res.push(...getMovesDown(pieceCoord, 
                             isPieceWhite, 
                             rows));

    // Left → Right //
    res.push(...getMovesRight(pieceCoord, 
                              isPieceWhite, 
                              cols));

    // Right → Left //
    res.push(...getMovesLeft(pieceCoord, 
                             isPieceWhite));

    return res;
}

function getMovesUpLeft(pieceCoord, isPieceWhite) {
    let res = [];

    for (let i = pieceCoord.i - 1, j = pieceCoord.j - 1; i >= 0 && j >= 0; i--, j--) {
        let currCell  = gBoard[i][j];
        let currCoord = { i: i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesUpRight(pieceCoord, isPieceWhite, cols) {
    let res = [];

    for (let i = pieceCoord.i - 1, j = pieceCoord.j + 1; i >= 0 && j < cols; i--, j++) {
        let currCell  = gBoard[i][j];
        let currCoord = { i: i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesDownRight(pieceCoord, isPieceWhite, rows, cols) {
    let res = [];

    for (let i = pieceCoord.i + 1, j = pieceCoord.j + 1; i < rows && j < cols; i++, j++) {
        let currCell  = gBoard[i][j];
        let currCoord = { i: i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getMovesDownLeft(pieceCoord, isPieceWhite, rows) {
    let res = [];

    for (let i = pieceCoord.i + 1, j = pieceCoord.j - 1; i < rows && j >= 0; i++, j--) {
        let currCell  = gBoard[i][j];
        let currCoord = { i: i, j: j };

        if (currCell === '') {   
            res.push(currCoord);
        } else {
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }

            break;
        }
    }

    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    const res  = [];
    const rows = gBoard.length;
    const cols = gBoard[0].length;
    const isPieceWhite = isCellWhite(pieceCoord);

    res.push(...getMovesUpLeft(pieceCoord, 
                               isPieceWhite));

    res.push(...getMovesUpRight(pieceCoord, 
                                isPieceWhite, 
                                cols));

    res.push(...getMovesDownRight(pieceCoord, 
                                  isPieceWhite, 
                                  rows, cols));

    res.push(...getMovesDownLeft(pieceCoord, 
                                 isPieceWhite, 
                                 rows));

    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    let res = [];

    const knightMoves = [
        { i: -2, j: -1 },
        { i: -2, j:  1 },
        { i: -1, j: -2 },
        { i: -1, j:  2 },
        { i:  1, j: -2 },
        { i:  1, j:  2 },
        { i:  2, j: -1 },
        { i:  2, j:  1 },
    ];

    const rows = gBoard.length;
    const cols = gBoard[0].length;
    const isPieceWhite = isCellWhite(pieceCoord);

    for (let move of knightMoves) {
        const targetI = pieceCoord.i + move.i;
        const targetJ = pieceCoord.j + move.j;

        if (targetI < 0 || targetI >= rows || targetJ < 0 || targetJ >= cols) {
            continue;
        }

        const currCell  = gBoard[targetI][targetJ];
        const currCoord = { i: targetI, j: targetJ };

        if (currCell === '') {
            res.push(currCoord)
        } else { 
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }
        }
    }

    return res;
}

function getAllPossibleCoordsQueen(pieceCoord) {
    let res = [];

    const rookMoves   = getAllPossibleCoordsRook(pieceCoord);
    const bishopMoves = getAllPossibleCoordsBishop(pieceCoord); 
    res = [...rookMoves, ...bishopMoves];

    return res;
}

function getAllPossibleCoordsKing(pieceCoord) {
    let res = [];

    const rows = gBoard.length;
    const cols = gBoard[0].length;
    const isPieceWhite = isCellWhite(pieceCoord);

    const kingMoves = [
        { i: -1, j:  0 },
        { i:  1, j:  0 },
        { i:  0, j: -1 },
        { i:  0, j:  1 },
        { i: -1, j: -1 },
        { i: -1, j:  1 },
        { i:  1, j: -1 },
        { i:  1, j:  1 }
    ];

    for (let move of kingMoves) {
        const targetI = pieceCoord.i + move.i;
        const targetJ = pieceCoord.j + move.j;

        if (targetI < 0 || targetI >= rows || targetJ < 0 || targetJ >= cols) {
            continue;
        }

        const currCell  = gBoard[targetI][targetJ];
        const currCoord = { i: targetI, j: targetJ };

        if (currCell === '') {
            res.push(currCoord)
        } else { 
            let isCurrCellWhite = isCellWhite(currCoord);
            if (isCurrCellWhite !== isPieceWhite) {
                res.push(currCoord);
            }
        }
    }

    return res;
}

function getAllPossibleCoordsPawn(pieceCoord, isPawnWhite) {
    let res = [];

    let diff      = (isPawnWhite) ? -1 : 1;
    let nextCoord = { i: pieceCoord.i + diff,
                      j: pieceCoord.j };

    if (isEmptyCell(nextCoord)) { 
        res.push(nextCoord); 
    } else { 
        return res;          
    }

    if (pieceCoord.i === gBoard.length - 2 && isPawnWhite ||
        pieceCoord.i === 1 && !isPawnWhite) {
        diff *= 2; 
        const nextCoord = { i: pieceCoord.i + diff,
                            j: pieceCoord.j };

        if (isEmptyCell(nextCoord)) res.push(nextCoord);
    }

    return res;
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === '';
}

function markCells(possibleCoords) {
    for (let i = 0; i < possibleCoords.length; i++) {
        let coord    = possibleCoords[i];
        const cellId = getSelectorId(coord);
        let elCell   = document.querySelector(cellId);
        if (elCell) elCell.classList.add('mark'); 
    }
}

function getSelectorId(coord) {
    return `#cell-${coord.i}-${coord.j}`;
}