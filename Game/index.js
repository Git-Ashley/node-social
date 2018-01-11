import React from 'react';
import NodeShooter from '../NodeShooter';
import {Rooms} from 'client-room';

export default class Game extends React.Component {
  constructor(props){
    super(props);

    const roomId = props.location.state.roomId;
    if(!roomId)
      throw console.log('ROOMID NOT DEFINED IN GAME COMPONENT!!!!');

    this._room = Rooms.get(roomId);
    if(!this.room)
      throw console.log('Room not found in game component');

    // TODO: Loading progress screen
    this.leave = this.leave.bind(this);
    this.gameInstance = NodeShooter()(this.room);
    this.room.initialized();
  }

  get room(){
    return this._room;
  }

  componentWillUnmount(){
    this.gameInstance.cleanup();
    this.room.leave();
  }

  leave(){
    this.props.history.goBack();
  }

  render(){
    return (
      <div>
        <div><button id="leave-node-shooter" type="button" onClick={this.leave}>Leave</button></div>
        <canvas id="node-shooter" height="800" width="800" style={{borderStyle: 'solid', borderWidth: 5 + 'px'}}></canvas>
      </div>
    );
  }
}
