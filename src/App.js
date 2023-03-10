import React, { useState } from 'react';

let winnerLines = [];

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button className={isWinner ? "winner-square" : "square"} onClick={onSquareClick}> {value} </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (currentMove === 9) {
    status = 'It is a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const index = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const grid = index.map((i) => {
    var cells = i.map((j) => {
      let isWinner = false;
      if (winnerLines.length !== 0 && winnerLines.includes(j)) {
        isWinner = true;
      }
      return (<Square key={j} value={squares[j]} onSquareClick={() => handleClick(j)} isWinner={isWinner} />);
    });

    return (
      <div key={i} className="board-row">{cells}</div>
    );
  });
  winnerLines = [];

  return (
    <>
      <div className="status">{status}</div>
      {grid}
    </>
  );
}

function ToggleSwitch({ checked, onChange }) {
  const switchButton = "Show in ascending order";
  return (
    <>
      <div>{switchButton}</div>
      <input type="checkbox" id="switch" name='switch' checked={checked} onChange={onChange} />
      <label htmlFor="switch" className="toggle" />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const [checked, setChecked] = useState(true);
  const handleChange = () => {
    setChecked(!checked);
  };

  const begginingSquares = [null, null, null, null, null, null, null, null, null]
  let previousHistory = begginingSquares;
  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const currentHistory = squares;
      const rowsAndCols = [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]];
      for (let i = 0; i < 9; i++) {
        if (currentHistory[i] !== previousHistory[i]) {
          description = <div>{"Row: " + rowsAndCols[i][0] + ", col: " + rowsAndCols[i][1]}</div>;
          break;
        }
      }
      previousHistory = currentHistory;
    } else {
      description = <button onClick={() => jumpTo(move)}>{'Go to game start'}</button>;
    }

    return (
      <li key={move}>{description}</li>
    );
  });

  moves = checked ? moves.sort() : moves.reverse();
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className='order'>
        <ToggleSwitch checked={checked} onChange={handleChange} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
      winnerLines = lines[i];
      return squares[a];
    }
  }
  return null;
}
