import Square from "./Square";

function Board(props) {
    const temp = makeBoard(props.n, props.m, props.squares, props.winners, props.onClick);
    return (
        <div>
            {temp}
        </div>
    )  
}

function renderSquare(i, square, winner, onClick) {
    return (
      <Square
        value={square}
        onClick={() => onClick(i)}
        winner={winner}
      />
    );
}

function makeBoard(nRow, nCol, squares, winners, onClick) {
    const options = [];
    for (let i = 0; i < nRow; i++) {
        const temp = [];
        for (let j = 0; j < nCol; j++) {
            temp.push(renderSquare(i * nRow + j, squares[i*nRow+j], winners[i*nRow+j], onClick));
        }
        options.push(<div>{temp}</div>)
    }
    return options;
}

export default Board;