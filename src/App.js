import { useState } from "react";

function Square({ value, index, winningMoves, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      <span className={winningMoves.includes(index) ? "winner" : "move"}>
        {value}
      </span>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    // if (squares[i] || calculateWinner(squares)) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    // if (["X", "O"].includes(nextSquares[i])) return;

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // nextSquares[i] = "X";
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winningMoves = [];
  if (winner && winner.player) {
    status = "Winner: " + winner.player;
    winningMoves = winner.winningMoves;
  } else if (!squares.includes(null)) {
    status = "Result is Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const renderSquare = (index) => (
    <Square
      value={squares[index]}
      index={index}
      winningMoves={winningMoves}
      onSquareClick={() => handleClick(index)}
    />
  );

  const renderRow = (row) => (
    <div className="board-row" key={row}>
      {[0, 1, 2].map((col) => (
        <span key={col}>{renderSquare(row * 3 + col)}</span>
      ))}
    </div>
  );

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(renderRow)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  // const [sortedHistory, setSortedHistory] = useState([Array(9).fill(null)]);
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  let winner;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // makeSquareWithMoves();
    // setSortedHistory(makeSquareWithMoves);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // const squareWithMoves = history.map((squares, move) => {
  //   return {
  //     arr: [...squares],
  //     position: move,
  //   };
  // });

  const sortedMovesArrInOrder = history
    .map((squares, move) => move)
    .sort((a, b) => (sortOrderAsc ? a - b : b - a));

  const sortMoves = () => {
    setSortOrderAsc(!sortOrderAsc);
    // setSortedHistory(makeSquareWithMoves);
  };

  const moves = sortedMovesArrInOrder.map((move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <label>{description}</label>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={sortMoves}>Toggle moves</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  let winningMoves;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winningMoves = lines[i];
      return {
        player: squares[a],
        winningMoves: winningMoves,
      };
    }
  }
  return null;
}
