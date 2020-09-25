import React from 'react';
import {IRound} from '../../App';

interface ISummaryProps {
  rounds: Array<IRound>;
}
interface Obj {
  [key: string]: number;
} 

const calcPoints = (rounds: Array<IRound>) => {
  let points: Obj = {};

  for(let round of rounds) {
    round.players.forEach(player => {
      if (points[player.player]) {
        points[player.player] = points[player.player] + player.points;
      } else {
        points[player.player] = player.points;
      } 
    })
  }
  return points;
}

export default (props: ISummaryProps) => {
  const nodes: Array<JSX.Element> = [];
  const points = calcPoints(props.rounds);
  for(let player in points) {
    nodes.push(<td key={player}>{player}: {points[player]}</td>);
  }
  return <table className="summary"><tbody>{nodes}</tbody></table>;
}

