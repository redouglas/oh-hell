import React from 'react';

interface IPlayerConfigProps {
  players: Array<string>;
  addPlayerFn: Function;
  removePlayerFn: Function;
};
interface IPlayerConfigState {
  newPlayerName: string;
}

class PlayerConfig extends React.Component<IPlayerConfigProps, IPlayerConfigState> {
  constructor(props: IPlayerConfigProps) {
    super(props);
    this.state = { newPlayerName:'' };
  }

  handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.newPlayerName && this.state.newPlayerName !== '') {
      this.props.addPlayerFn(this.state.newPlayerName);
      this.setState({newPlayerName: ''});
    }
  }

  handleRemovePlayer = (name: string) => {
    this.props.removePlayerFn(name);
  }

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({newPlayerName: e.target.value});
  }

  renderPlayerList = (players: Array<string>) => {
    if (players && players.length) {
      return players.map((player: any) => (
        <li key={player}>
          <span className="player-name">{player}</span>
          <span className="player-delete" onClick={() => this.handleRemovePlayer(player)}>remove</span>
        </li>)
      );
    }
    return <li>No players yet. Add one to get started.</li>
  }

  render() {
    return (
      <div className="player-config">
        <ul className="current-players">
          <h3>Players:</h3>
          { this.renderPlayerList(this.props.players) }
        </ul>
        <div className="add-player-form">
          <form onSubmit={this.handleAddPlayer}>
            <input type="text" placeholder="Name..." value={this.state.newPlayerName} onChange={this.handleNameChange} />
            <button onClick={this.handleAddPlayer}>Add Player</button>
          </form>
        </div>
      </div>
      );
  }
}

export default PlayerConfig;
