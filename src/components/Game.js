import React, { useState } from 'react';
import Board from './Board';

function Game(props) {
    const [n, setN]=useState(5);
    const [m, setM]=useState(5);
    const [squares, setSquares]=useState(Array(n*m).fill(null));
    const [history, setHistory]=useState([-1]);
    const [xIsNext, setXIsNext]=useState(true);
    const [descendingSort, setDescendingSort]=useState(false);
    const [winner, setWinner]=useState(Array(n*m).fill(null));
    const [numberOfMovesLeft, setNumberOfMovesLeft]=useState(n*m);
    const [isWin, setIsWin]=useState(false);
  
    
    function calculateWinner(squares) {
        let nMoveToWin = Math.min(n, m);
        var winner = null;
        var winnerMoves = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                var i2 = i;
                var j2 = j;
                var tmp = i * n + j;
                if (squares[tmp] == null) continue;
                var tmp2 = i2 * n + j2;
                var tmpMoves = [];
                while (i2 < n && j2 < m && squares[tmp] === squares[tmp2]) {
                    i2++;
                    j2++;
                    tmpMoves.push(tmp2);
                    tmp2 = i2 * n + j2;
                }
                if (i2 - i === nMoveToWin) {
                    winnerMoves = tmpMoves;
                    winner = squares[tmp];
                    break;
                }
                i2 = i;
                j2 = j;
                tmp2 = i2 * n + j2;
                tmpMoves = [];
                while (i2 < n && j2 < m && squares[tmp2] === squares[tmp]) {
                    i2++;
                    tmpMoves.push(tmp2);
                    tmp2 = i2 * n + j2;
                }
                if (i2 - i === nMoveToWin) {
                    winnerMoves = tmpMoves;
                    winner = squares[tmp];
                    break;
                }
                i2 = i;
                j2 = j;
                tmp2 = i2 * n + j2;
                tmpMoves = [];
                while (i2 < n && j2 < m && squares[tmp2] === squares[tmp]) {
                    j2++;
                    tmpMoves.push(tmp2);
                    tmp2 = i2 * n + j2;
                }
                if (j2 - j === nMoveToWin) {
                    winnerMoves = tmpMoves;
                    winner = squares[tmp];
                    break;
                }
                i2 = i;
                j2 = j;
                tmp2 = i2 * n + j2;
                tmpMoves = [];
                while (i2 >= 0 && j2 >= 0 && squares[tmp2] === squares[tmp]) {
                    i2--;
                    j2--;
                    tmpMoves.push(tmp2);
                    tmp2 = i2 * n + j2;
                }
                if (i - i2 === nMoveToWin) {
                    winnerMoves = tmpMoves;
                    winner = squares[tmp];
                    break;
                }
            }
            if (winner != null) break;
        }
        var winners = Array(n * m).fill(null);
        if (winner != null) {
            for (var i = 0; i < winnerMoves.length; i++) {
            winners[winnerMoves[i]] = 1;
            }
        }
        return {
            winner: winner,
            winnerMoves: winners
        };
    }

    function handleClick(i) {
        const History = history;
        const Squares = squares;
        if (isWin || Squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";

        setHistory(history.concat([i]));
        setXIsNext(!xIsNext);
        setDescendingSort(descendingSort);
        setNumberOfMovesLeft(numberOfMovesLeft-1);
    }
  
    function jumpTo(move) {
        var N = n;
        var M = m;
        
        if (move !== history.length - 1) {
            setIsWin(false);
        }
        const squares = Array(n * m).fill(null);
        const History = history.slice(0, move + 1)
        for (let i = 1; i < history.length; i++) {
            squares[History[i]] = (i % 2 === 1 ? 'X' : 'O');
        }
        setWinner(Array(n * m).fill(null));
        setHistory(History);
        setSquares(squares);
        setXIsNext(move%2===0);
        setDescendingSort(descendingSort);
        setNumberOfMovesLeft(n*m-move);
    }
  
    function changeSortOrder() {
        setDescendingSort(!descendingSort);
    }
      
    var status;
    if(isWin){
        status="Game is over, the winner is "+(xIsNext ? 'O' : 'X');
    }
    else if(numberOfMovesLeft===0){
        status="Game is drawn";
    }
    else{
        status="Next move: "+(xIsNext ? 'X' : 'O');
    }
  
    let res = calculateWinner(squares);
    var winnerMoves = res.winnerMoves;

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        const position = step > -1 ?
            '(' + Math.floor(step / n) + ',' + step % m + ')' : '(,)';
        return (
            <li key={move}>
                <div>
                    {position}
                </div>
                <button class="btn" onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    if (descendingSort) {
        moves.reverse();
    }

    if (res.winner && !isWin) {
        setIsWin(true);
        setWinner(res.winnerMoves);
    }
  
    let sortOrder;
    if (descendingSort) {
        sortOrder = "Ascending Sort";
    }
    else {
        sortOrder = "Descending Sort"
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board squares={squares}
                        onClick={(i) => handleClick(i)}
                        winners={winnerMoves}
                        n={n}
                        m={m} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            <div>
                <button onClick={() => changeSortOrder()}>{sortOrder}</button>
            </div>
        </div>
    );
}

export default Game;