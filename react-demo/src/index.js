import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

const Square = (props) => (
  <button 
    style={{ backgroundColor: props.bgColor }}
    className="square" 
    onClick={props.onClick}
  >
    {props.value}
  </button>
);

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.handleOnClick(i)}
        bgColor={this.props.position && this.props.position.includes(i) ? 'yellow' : 'white'}
      />
    );
  }

  render() {
    return (
      <div className="board">
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

const calculateWinner = (squares) => {
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

  let winner = null
  let position = null;
  lines.forEach((line) => {
    const [a, b, c] = line;
    if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
      winner = squares[a];
      position = line;
    }
  });

  return { winner, position };
};

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: props.isDialogOpen,
    }
  }

  render() {
    const { isDialogOpen } = this.state;

    return (
      isDialogOpen && (
        <div className='dialog' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: 'large', fontWeight: 'bold' }}>{this.props.title}</div>
          <div style={{ textAlign: 'center', fontSize: 'large' }}>{this.props.content}</div>
          <button style={{ width: '60px', alignSelf: 'center', marginBottom: '20px' }} onClick={() => this.setState({ isDialogOpen: false })}>確定</button>
        </div>
    ));
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleOnClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: [...history, { squares }], 
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
     });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }  

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, position } = calculateWinner(current.squares);
    const status = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}`
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            handleOnClick={i => this.handleOnClick(i)}
            position={position}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>

        { winner && (
          <Dialog
            isDialogOpen={!!winner}
            title="提示訊息"
            content={`${winner}獲勝了!`}
          />
        )}
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
