import React, { useState, useEffect } from "react";
import Cell from "./Cell";

const Board = ({ rows, cols, mines }) => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${rows}, 30px)`, // 30px is an example cell size
    gridTemplateRows: `repeat(${cols}, 30px)`,
    gap: "2px",
    // margin: "20px auto",
  };

  useEffect(() => {
    initializeBoard();
  }, [rows, cols, mines]);

  const initializeBoard = () => {
    let newBoard = createEmptyBoard(rows, cols);
    placeMines(newBoard, mines);
    calculateNeighbors(newBoard);
    setBoard(newBoard);
  };

  const createEmptyBoard = (rows, cols) => {
    let board = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighboringMines: 0,
        });
      }
      board.push(row);
    }
    return board;
  };

  const placeMines = (board, mines) => {
    let mineCount = 0;
    while (mineCount < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        mineCount++;
      }
    }
  };

  const calculateNeighbors = (board) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (!board[r][c].isMine) {
          let mineCount = 0;
          directions.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              board[nr][nc].isMine
            ) {
              mineCount++;
            }
          });
          board[r][c].neighboringMines = mineCount;
        }
      }
    }
  };

  const handleClick = (row, col) => {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged)
      return;

    let newBoard = [...board];
    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].isMine) {
      setGameOver(true);
      revealBoard(newBoard);
    } else if (newBoard[row][col].neighboringMines === 0) {
      revealEmptyCells(newBoard, row, col);
    }

    setBoard(newBoard);
    checkWin(newBoard);
  };

  const revealEmptyCells = (board, row, col) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !board[nr][nc].isRevealed
      ) {
        board[nr][nc].isRevealed = true;
        if (board[nr][nc].neighboringMines === 0) {
          revealEmptyCells(board, nr, nc);
        }
      }
    });
  };

  const handleRightClick = (row, col) => {
    if (board[row][col].isRevealed || gameOver) return;

    let newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setBoard(newBoard);
    setFlagCount(flagCount + (newBoard[row][col].isFlagged ? 1 : -1));
  };

  const handleDoubleClick = (row, col) => {
    const cell = board[row][col];
    if (cell.isRevealed && cell.neighboringMines > 0) {
      const surroundingCells = getSurroundingCells(row, col);
      const flaggedCount = surroundingCells.filter(
        (cell) => board[cell.row][cell.col].isFlagged
      ).length;

      console.log(surroundingCells);
      console.log(flaggedCount);

      if (flaggedCount === cell.neighboringMines) {
        // Reveal all surrounding cells
        surroundingCells.forEach(({ row, col }) => {
          if (!board[row][col].isRevealed && !board[row][col].isFlagged) {
            handleClick(row, col); // Use existing handleClick to reveal cell
          }
        });
      }
    }
  };

  const getSurroundingCells = (row, col) => {
    const cells = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !(i === 0 && j === 0)
        ) {
          cells.push({ row: newRow, col: newCol });
        }
      }
    }
    return cells;
  };

  const checkWin = (board) => {
    let unrevealedCount = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isRevealed && !cell.isMine) unrevealedCount++;
      });
    });

    if (unrevealedCount === 0) {
      setGameOver(true);
      setIsWin(true);
      revealBoard(board);
    }
  };

  const revealBoard = (board) => {
    let newBoard = board.map((row) =>
      row.map((cell) => ({ ...cell, isRevealed: true }))
    );
    setBoard(newBoard);
  };

  return (
    <div className="board" style={boardStyle}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell.neighboringMines}
              onClick={() => handleClick(rowIndex, colIndex)}
              onRightClick={() => handleRightClick(rowIndex, colIndex)}
              onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
              isRevealed={cell.isRevealed}
              isFlagged={cell.isFlagged}
              isMine={cell.isMine}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
