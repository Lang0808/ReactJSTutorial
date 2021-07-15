import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_concurrentAct } from 'react-dom/cjs/react-dom-test-utils.production.min';
import './index.css';


function Square(props){
    if(props.winner){
        return <button className="win" onClick={props.onClick}>
                    {props.value}
        </button>
    }
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
}

class Board extends React.Component{
    renderSquare(i){
        return <Square value={this.props.squares[i]}
                        onClick={()=>this.props.onClick(i)}
                        winner={this.props.winners[i]}/>
    }
    makeBoard(nRow, nCol){
        const options=[];
        for(let i=0;i<nRow;i++){
            const temp=[];
            for(let j=0;j<nCol;j++){
                temp.push(this.renderSquare(i*nRow+j));
            }
            options.push(<div>{temp}</div>)
        }
        return options;
    }
    render(){
        const temp=this.makeBoard(3, 3);
        return (
            <div>
                {temp}
            </div>
        )
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            history : [
                -1,
            ],
            XIsNext: true,
            reverseHistory: false,
            winner: Array(9).fill(null),
            numberOfMovesLeft: 9,
        }
    }
    handleClick(i){
        const history=this.state.history;
        const squares=this.state.squares;
        if(squares[i] || this.calculateWinner(squares)) return;
        squares[i]=(this.state.XIsNext ? 'X': 'O');
        this.setState({
            history: history.concat([
                i,
            ]),
            XIsNext: !this.state.XIsNext,
            reverseHistory: this.state.reverseHistory,
            numberOfMovesLeft: this.state.numberOfMovesLeft-1,
        });
    }
    calculateWinner(squares){
        const lines=[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        //const history=this.state.history;
        for(let i=0;i<lines.length;i++){
            let [a, b, c]=lines[i];
            if(squares[a] && squares[a]==squares[b] && squares[a]==squares[c]) {
                this.state.winner[a]=1;
                this.state.winner[b]=1;
                this.state.winner[c]=1;
                return squares[a];
            }
        }
        return null;
    }
    jumpTo(move){
        const squares=Array(9).fill(null);
        console.log(move);
        
        const history=this.state.history.slice(0, move+1);
        console.log(history);
        for(let i=1;i<history.length;i++){
            squares[history[i]]=(i%2==1?'X':'O');
        }
        this.setState({
            winner: Array(9).fill(null),
            history: history,
            squares: squares,
            //stepNumber: move,
            XIsNext: (move%2==0),
            reverseHistory: this.state.reverseHistory,
            numberOfMovesLeft: 9-move,
        });
    }

    reverseH(){
        this.setState({
            reverseHistory: !this.state.reverseHistory,
        });
    }

    render(){
        const squares=this.state.squares;
        const history=this.state.history;
        var nextMove="Next move: "+(this.state.XIsNext ? 'X' : 'O');
        let winner=this.calculateWinner(squares);
        var draw=null;
        var moves;
        moves=history.map((step, move)=>{
            const desc=move ?
                        "Go to move#"+move :
                        "Go to game start";
            return (
                <li key={move}>
                    <button class="btn"
                            onClick={()=>this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        });
        if(this.state.reverseHistory){
            moves.reverse();
        }
        if(winner){
            nextMove="The winner is "+winner;
        }
        else{
            draw=(this.state.numberOfMovesLeft==0 ? alert("The final result is draw"): null);
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares}
                            onClick={(i)=>this.handleClick(i)}
                            winners={this.state.winner}/>
                </div>
                <div className="info">{nextMove}</div>
                <ol id="moves">{moves}</ol>
                <div>
                    <button onClick={()=>this.reverseH()}>Reverse History !</button>
                </div>
                {draw}
            </div>
        )
        
    }
}

// ========================================

ReactDOM.render( <Game/> ,document.getElementById('root'));