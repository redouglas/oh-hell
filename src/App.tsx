import React from 'react';

import PlayerConfig from './components/PlayerConfig/PlayerConfig';
import Round from './components/Round/Round';
import Summary from './components/Summary/Summary';

interface IAppProps {}
interface IAppState {
  players: Array<string>;
  betBonus: number;
  rounds: Array<IRound>;
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
}

export class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      betBonus: 10,
      players: [],
      rounds: []
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
    newRounds.push(this.generateRound());
    this.setState({rounds: newRounds})
  }

  generateRound(): IRound {
    const newRoundPlayers: Array<IPlayerRound> = this.state.players.map(player => {
      return {
        player: player,
        points: 0
      }
    });
    const newRound: IRound = {
      over: false,
      players: newRoundPlayers
    };
    return newRound
  }

  handleBetBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({betBonus: parseInt(e.target.value, 10)});
  }

  handleStartGame = () => {
    const firstRound = this.generateRound();
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
          <label>Bet Bonus:</label>
          <input type="text" value={this.state.betBonus} onChange={this.handleBetBonusChange} />
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
    return this.state.rounds.map((round, index) => <Round key={index} round={round} cardCount={index + 3} betBonus={this.state.betBonus} endRoundFn={this.endRound} />)
  }

  render() {
    return (
      <div className="App">
        { this.renderConfigOrGame() }
      </div>
    );
  }
}
