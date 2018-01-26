import React from 'react';
import Lobby from './Lobby';
import Game from './Game';
import {Provider} from 'react-redux';
import store from './store';
import {Route, Switch} from 'react-router-dom';
import {appStarted} from './actions/userActions';
import {Rooms} from 'client-room';

export default class NodeSocial extends React.Component {
  constructor(props){
    super(props);
    store.dispatch(appStarted(props.user));
  }

  render(){
    return (
      <section style={{height: '100%', ...this.props.style}}>
        <Provider store={store}>
          <Switch>
            <Route path={this.props.match.path} exact component={Lobby} />
            <Route path={`${this.props.match.path}/game`} component={Game} />
          </Switch>
        </Provider>
      </section>
    );
  }

  componentWillUnmount(){

    //Remove this (terrible code) once clietn room auto socket close imeplemented
    let last = true;
    for(let [roomId, room] of Rooms){
      room.leave();
      if(last)
        room._socket.close();
    }
  }
};
