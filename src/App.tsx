import React from 'react';

import PlayerConfig from './components/PlayerConfig/PlayerConfig';
import Round from './components/Round/Round';
import Summary from './components/Summary/Summary';

interface IAppProps {}
interface IAppState {
  players: Array<string>;
  betBonus: number;
  rounds: Array<IRound>;
  cardsMin: number;
  cardsMax: number;
  cardsDecreasing: Boolean;
  gameOver: Boolean;
}

export interface IPlayerRound {
  player: string;
  bet?: number;
  won?: number;
  points: number;
}
export interface IRound {
  over?: boolean;
  players: Array<IPlayerRound>
  cardCount: number;
}

export class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      betBonus: 10,
      players: [],
      rounds: [],
      cardsMax: 10,
      cardsMin: 3,
      cardsDecreasing: false,
      gameOver: false,
    }
  }

  addPlayer = (name: string) => {
    const newPLayerList: Array<string> = [...this.state.players];
    newPLayerList.push(name);
    this.setState({players: newPLayerList});
  }

  removePlayer = (name: string) => {
    const index = this.state.players.indexOf(name);
    let newPlayerList: Array<string> = [...this.state.players];
    if (index > -1) {
      newPlayerList.splice(index, 1);
    }
    this.setState({players: newPlayerList});
  }

  gameStarted(): Boolean {
    return this.state.rounds.length !== 0;
  }

  endRound = () => {
    const newRounds = [...this.state.rounds];
    newRounds[this.state.rounds.length - 1].over = true;
    const currentCardCount = this.state.rounds[this.state.rounds.length - 1].cardCount;
    
    // check game over
    if (this.state.cardsDecreasing && currentCardCount === this.state.cardsMin) {
      this.setState({gameOver: true});
    } else {
      let nextCardCount; 

      if (this.state.cardsDecreasing) {
        nextCardCount = currentCardCount - 1;
      } else if (currentCardCount + 1 <= this.state.cardsMax) {
        nextCardCount = currentCardCount + 1;
      } else {
        nextCardCount = currentCardCount - 1;
        this.setState({cardsDecreasing: true});
      }
      newRounds.push(this.generateRound(nextCardCount));
    }    
    this.setState({rounds: newRounds});
  }

  generateRound(cardCount: number): IRound {
    const newRoundPlayers: Array<IPlayerRound> = this.state.players.map(player => {
      return {
        player: player,
        points: 0
      }
    });
    const newRound: IRound = {
      over: false,
      players: newRoundPlayers,
      cardCount: cardCount
    };
    return newRound
  }

  handleBetBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({betBonus: parseInt(e.target.value, 10)});
  }

  handleCardMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({cardsMax: parseInt(e.target.value, 10)});
  }

  handleCardMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({cardsMin: parseInt(e.target.value, 10)});
  }

  handleStartGame = () => {
    const firstRound = this.generateRound(this.state.cardsMin);
    this.setState({rounds: [firstRound]});
  }

  renderHeaders = () => {
    return this.state.players.map(player => <td key={player}>{player}</td>);
  }

  renderConfigOrGame() {
    if (!this.gameStarted()) {
      return (
        <div className="game-config">
          <h1>Oh Hell!</h1>
          <PlayerConfig players={this.state.players} addPlayerFn={this.addPlayer} removePlayerFn={this.removePlayer}></PlayerConfig>
          <h3>Options:</h3>
          <div>
            <label>Bet Bonus:</label>
            <input type="number" value={this.state.betBonus} onChange={this.handleBetBonusChange} />
          </div>
          <div>
            <label>Cards min:</label>
            <input type="number" value={this.state.cardsMin} onChange={this.handleCardMinChange} />
          </div>
          <div>
            <label>Cards max:</label>
            <input type="number" value={this.state.cardsMax} onChange={this.handleCardMaxChange} />
          </div>
          <button onClick={this.handleStartGame} className="start-game-button">Start Game</button>
        </div>
      )
    } else {
      return (
        <div className="game-in-progress">
          <table className="game-table">
            <thead>
              <tr>
                <td># Cards</td>
                {this.renderHeaders()}
              </tr>
            </thead>
            <tbody>{this.renderRounds()}</tbody>
            </table>
          <Summary rounds={this.state.rounds} />
        </div>
      )
    }
  }

  renderRounds() {
    return this.state.rounds.map((round, index) => <Round key={index} round={round} betBonus={this.state.betBonus} endRoundFn={this.endRound} />)
  }

  render() {
    return (
      <div className="App">
        { this.renderConfigOrGame() }
      </div>
    );
  }
}
