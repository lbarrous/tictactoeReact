import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

/*class Square extends React.Component {

    //All React component classes that have a constructor should start it with a super(props) call.
    //constructor(props) {
      //super(props);
      //this.state = {
        //value: null, 
      //}
    //}

    render() {
      return (
        // writing onClick={alert('click')} is a common mistake, and would fire the alert every time the component re-renders.
        <button 
        className="square" 
        onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
  }*/

  //In a class, we used an arrow function to access the correct this value, but in a functional component we don’t need to worry about this.
  function Square(props) {
    return (
      <button 
        className={props.checkSelected +" "+ props.checkWinner +" "+ props.checkDraw}
        onClick={() => props.onClick()}>
          {props.value}
        </button>
    )
  }
  
  class Board extends React.Component {

    /*constructor(props) {
      super(props);

      this.state = {
        squares: Array(9).fill(null),
        XisNext: true,
      }
    }*/

    /*handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i])
        return;

      squares[i] = this.state.XisNext ? 'X' : 'O';
      this.setState({
        //Unlike the array push() method you might be more familiar with, the concat() method doesn’t mutate the original array, so we prefer it.
        history: history.concat([{
          squares: squares,
        }]),
        XisNext: !this.state.XisNext,
      });
    }*/

    renderSquare(i) {
      return <Square 
      value={this.props.squares[i]}
      checkSelected={this.checkSelected(i)}
      checkWinner={this.checkWinner(i)}
      checkDraw={this.checkDraw(i)}
      onClick={() => this.props.onClick(i)}
      />;
    }

    checkSelected(i) {
      let cssClassChosen = 'square';

      if(this.props.last_movement === i && (this.props.squares[i] === 'X' || this.props.squares[i] === 'O'))
        cssClassChosen += " last-chosen";

      return cssClassChosen;
    }

    checkWinner(i) {
      let cssClassWinner = '';

      if(this.props.winningNumbers.indexOf(i) >= 0)
        cssClassWinner += 'winner';

      return cssClassWinner;
    }

    checkDraw(i) {
      let cssClassDraw = '';

      if(this.props.matchDraw)
        cssClassDraw += 'draw';

      return cssClassDraw;
    }
  
    render() {
      /*const winner = calculateWinner(this.state.squares);

      let status;
      
      if(winner) {
        status = "Winner: player " + winner;
      }
      else {
        status = 'Next player: ' + (this.state.XisNext ? 'X' : 'O');
      }*/
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          moves: Array(2).fill(null),
          last_movement: null,
        }],
        XisNext: true,
        stepNumber: 0,
        winningNumbers: [],
        matchDraw: false,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      
      const move = getMoveByArray(i);
      const last_movement = i;
      let winningN = [];

      if(squares[i] || this.state.winningNumbers.length > 0)
        return;

      squares[i] = this.state.XisNext ? 'X' : 'O';

      const draw = squares.every( (val, i, arr) => val !== null );

      if(draw) {
        this.setState({
          matchDraw: true,
        })
      }

      const winner = calculateWinner(squares);

      if(winner.length > 0) {
        if(this.state.winningNumbers.length <= 0) {
          winningN = winner;
        }
      }

      this.setState({
        //Unlike the array push() method you might be more familiar with, the concat() method doesn’t mutate the original array, so we prefer it.
        history: history.concat([{
          squares: squares,
          moves: move,
          last_movement: last_movement,
        }]),
        stepNumber: history.length,
        XisNext: !this.state.XisNext,
        
        winningNumbers: winningN,
      });

    }

    jumpTo(step) {
      const current = this.state.history[step];
      const squares = current.squares.slice();

      const winner = calculateWinner(squares);
      let winningN = [];
      let matchDraw = false;

      if(winner.length > 0) {
        //if(this.state.winningNumbers.length <= 0) {
          winningN = winner;
        //}
      }

      const draw = squares.every( (val, i, arr) => val !== null );

      if(draw) {
        matchDraw = true;
      }

      this.setState({
        stepNumber: step,
        XisNext: (step % 2) === 0,
        winningNumbers: winningN,
        matchDraw: matchDraw,
      })
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      

      const moves = history.map((step, move) => {
        const desc = move ? 
          'Go to move #' + move :
          'Go to game start';

        const row = history[move].moves[0] !== null ? `Row: ${history[move].moves[0]}` : '';
        const column = history[move].moves[1] !== null ? `Column: ${history[move].moves[1]}` : '';

          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc} - {row + " " + column}</button>
            </li>
          );
      });

      let status;

      if(winner.length > 0)
        status = "Winner: Player " + (!this.state.XisNext ? "X" : "O");
      else
        status = "Next Player: " + (this.state.XisNext ? "X" : "O");

      if(this.state.matchDraw) {
        status = "Match draw"
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              last_movement = {current.last_movement}
              winningNumbers = {this.state.winningNumbers}
              matchDraw = {this.state.matchDraw}
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
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
        return [a,b,c];
      }
    }
    return [];
  }

  function getMoveByArray(move) {
    let row;
    let column;

    if(move === 0 || move === 3 || move === 6)
      column = 1;
    else if(move === 1 || move === 4 || move === 7)
      column = 2;
    else if(move === 2 || move === 5 || move === 8)
      column = 3;

    if(move === 0 || move === 1 || move === 2)
      row = 1;
    else if(move === 3 || move === 4 || move === 5)
      row = 2;
    else if(move === 6 || move === 7 || move === 8)
      row = 3;

     return [row, column]; 
  }