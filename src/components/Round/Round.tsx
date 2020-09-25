import React from 'react';
import {IRound, IPlayerRound} from '../../App';

interface IRoundProps {
  cardCount: number;
  betBonus: number;
  round: IRound;
  endRoundFn: Function;
};
interface IRoundState {
  playerRounds: Array<IPlayerRound>;
}

class Round extends React.Component<IRoundProps, IRoundState> {
  constructor(props: IRoundProps) {
    super(props);
    this.state = { playerRounds: props.round.players };
  }

  getPlayerIndex(playerName: string): number {
    let idx = -1;
    this.state.playerRounds.forEach((player, index) => {
      if (player.player === playerName) {idx = index;}
    });
    return idx;
  }

  areBetsValid = () => {
    let betTotal = 0;
    for (let p of this.state.playerRounds) {
      if (p.bet) { betTotal = betTotal + p.bet; }
    }
    if (betTotal === this.props.cardCount) {
      return false;
    }
    return true;
  }

  handleBetChange(playerName: string, e:React.ChangeEvent<HTMLInputElement>) {
    const playerIndex = this.getPlayerIndex(playerName);
    const player = this.state.playerRounds[playerIndex];
    const newVal = parseInt(e.target.value, 10);
    player.bet = newVal;

    const newState = [...this.state.playerRounds];
    newState[playerIndex] = player;
    this.setState({playerRounds: newState});
  }

  handleWinChange(playerName: string, e:React.ChangeEvent<HTMLInputElement>) {
    const playerIndex = this.getPlayerIndex(playerName);
    const player = this.state.playerRounds[playerIndex];
    const newVal = parseInt(e.target.value, 10);
    let points = newVal;
    if (newVal === player.bet) { points = points + this.props.betBonus };
    player.points = points;

    const newState = [...this.state.playerRounds];
    newState[playerIndex] = player;
    this.setState({playerRounds: newState});
  }

  handleRoundEnd() {
    this.props.endRoundFn();
  }

  renderCol = (player: IPlayerRound) => {
    return (
      <table className={"game-table-col" + (this.props.round.over ? ' over' : ' in-progress')}>
        <thead>
          <tr>
            <td>Bet</td>
            <td>Won</td>
            <td>Points</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" onChange={(e) => this.handleBetChange(player.player, e)} /></td>
            <td><input type="text" onChange={(e) => this.handleWinChange(player.player, e)} /></td>
            <td>{player.points}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderCols = () => {
    return this.props.round.players.map(player => <td key={player.player}>{this.renderCol(player)}</td>);
  }

  renderError = () => {
    if (!this.areBetsValid()) {
      return (<span className="error">Bets cannot equal # of cards in a round. Last person to bet needs to change.</span>);
    }
  }

  render() {
    return (
        <tr>
          <td>{this.props.cardCount}</td>
          {this.renderCols()}
          <td>
            <button className={'end-round-button' + (this.props.round.over ? ' over' : ' in-progress')} onClick={() => this.handleRoundEnd()}>End Round</button>
            { this.renderError() }
          </td>
        </tr>
    );
  }
}

export default Round;
