import { useState } from "react";

//This is Square Component
//Each Square represents each cell on the Board
function Square({ value, onSquareClick, isWinLine }) {

  return (
    <button
      className={`square ${isWinLine ? 'win-line' : null}`}
      onClick={onSquareClick}
    >
      {value}
    </button>);
}

//this is Board Button component
function Board({ xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares);
  let status;
  if (winner.winner === -1) {
    status = "DRAW"
  }
  else if (winner.winner != null) {

    status = "Winner: " + winner.winner;

  }
  else {
    status = "Next player's turn: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {

    if (squares[i] || winner.winner) {
      return
    }

    const nextSquares = squares.slice();
    if (xIsNext === true) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  //remove hardcoding, using two loops to create the board.

  let nRows = Array.from({ length: 3 }, (value, index) => index);

  const cells = nRows.map((key, rowNo) => {
    let nCols = Array.from({ length: 3 }, (value, index) => index);
    const cols = nCols.map((key, colNo) => {

      let cellNo = rowNo * 3 + colNo;
      return (
        <Square key={colNo} isWinLine={winner.line.includes(cellNo)} value={squares[cellNo]} onSquareClick={() => handleClick(cellNo)} />
      )
    })

    return (
      <div key={'br' + key} className="board-row">
        {cols}
      </div>
    )
  })


  return (
    <>
      <div className="status">{status}</div>
      {cells}
    </>
  );
}

//this is Sort Button component
function SortBtn({ isASC, handleSort }) {
  let sortMode;
  let currentMode;
  if (!isASC) {
    sortMode = 'ASC';
    currentMode='DESC'
  } else {
    sortMode = 'DESC';
    currentMode='ASC';
  }


  return (
    <>
      <button className="SortBtn" onClick={handleSort}>{'Sort '+sortMode}</button>
      <div className="CurrentSortOrder">Current Order: {currentMode}</div>
    </>

  )
}


//this function is for determining the winner (also draw situation)
function calculateWinner(squares) {

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }
  if (!squares.includes(null)) {
    return {
      winner: -1,
      line: []
    }
  }
  return {
    winner: null,
    line: []
  };
}

//this function calculate the current position displayed in [row,col] format.
function calculatePosition(pos) {
  const col = (pos + 1) % 3 === 0 ? 3 : (pos + 1) % 3;
  const row = Math.floor(pos / 3) + 1;
  return [row, col]
}


// the main game component
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [isASC, setASC] = useState(true);
  const [history, setHistory] = useState([{ history: Array(9).fill(null), lastMove: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove].history
  const [isRestart,setRestart]= useState(0);
  function handlePlay(nextSquares, lastMove) {
    const nextHistory = [...history.slice(0, currentMove + 1), { history: nextSquares, lastMove: lastMove }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
    setRestart(false)
    // console.log(history)
  }

  function handleSort() {
    setASC(!isASC);
  }

  function jumpTo(nextMove) {
    if (nextMove===0){
      setRestart(true)
    }
    else{
      setRestart(false)
    }
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }


  const moveHistory = isASC ? history : history.toReversed();
  const moves = moveHistory.map((squares, move) => {
    let description;
    const isCurrentMove = isASC ? move === currentMove : move === history.length - 1 - currentMove;
    const actualMove = isASC ? move : history.length - 1 - move;
    const isMove = isASC ? move > 0 : move < history.length - 1;
    if (isMove) {
      const pos = calculatePosition(squares.lastMove);
      const row = pos[0];
      const col = pos[1];

      if (isCurrentMove) {
        description = 'You are at move #' + actualMove + ` (${row},${col})`;
      }
      else {
        description = 'Go to move #' + actualMove + ` (${row},${col})`;
      }

    } else {
      description = 'Go to game start';
    }

    return (<li className="move-li" key={squares.history}>
      {(isCurrentMove && isMove) ? (<div className="current-move">{description}</div>) : (<button className={`move ${isRestart && actualMove===0?'restart':null}`} onClick={() => jumpTo(actualMove)}>{description}</button>)}
    </li>)
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <SortBtn isASC={isASC} handleSort={handleSort}></SortBtn>
        <ul>{moves}</ul>
      </div>
    </div>
  )
}