import React, {} from 'react';
import styles from './GameCreation.css';
import button from '@styles/button.css';
import CreateGameDialog from './CreateGameDialog.js';
import text from '@styles/text.css';

import {connect} from 'react-redux';

export default class GameCreation extends React.PureComponent {

  constructor(props){
    super(props);

    this.state = {
      showCreateDialog: false
    };

    this.timeStr = this.timeStr.bind(this);
    this.setupTimer = this.setupTimer.bind(this);
  }

  render(){
    return (
      <div className={styles.container}>
        <div className={styles.title}>Game List</div>
        <div style={{flex: 5}}>
          {
            this.props.gameList.map(game => {
              return (<div key={game.id} className={`${styles.gameWrap} ${text.center}`}>
                <div className={styles.gameName}>{game.name}</div>
                <div>players: {game.playerCount}</div>
                <div ref={e => this.setupTimer(e, game)}>{this.timeStr(game)}</div>
                <div className={`${button.bordered} ${button.green}`} onClick={() => this.props.onJoinGame(game.id)}>Join</div>
              </div>);
            })
          }
        </div>
        { this.state.showCreateDialog ?
          <CreateGameDialog onSubmit={this.props.onCreateGame} root="node-social-popup" onClose={()=>{this.setState({showCreateDialog: false})}}/>
          : null
        }
        <div className={`${button.bordered} ${button.green} ${styles.createButton}`} type="button" onClick={() => {this.setState({showCreateDialog: true})}}>
          Create Game
        </div>
      </div>
    );
  }

  timeStr(game){
    if(!game.timer)
      return '∞';

    let timeLeft = Math.floor(game.timer - ((new Date().getTime() / 1000) - game.timeCreated));
    if(timeLeft < 0)
      timeLeft = 0;
    const seconds = new Date(null);
    seconds.setSeconds(timeLeft);
    return seconds.toISOString().substr(11, 8);
  }

  setupTimer(ele, game){

    console.log(`registering element: ${JSON.stringify(game)}`);

    setInterval(()=>{
      if(!game.timer || !game.timeCreated || !ele || !ele.innerHTML)
        return;
      ele.innerHTML = this.timeStr(game);
    }, 1000);
  }


};
