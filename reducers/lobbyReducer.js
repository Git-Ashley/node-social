import * as Types from '../actions/actionTypes';
import initialState from './initialState';
import OrderedHash from '@lib/OrderedHash';

export default function lobbyReducer(state = initialState.lobby, action){

  switch(action.type){
    case Types.ADD_MESSAGE:
      return Object.assign({}, state, {chatMessages: [...state.chatMessages, action.message]});

    case Types.SEND_MESSAGE_ERROR:
      //TODO implement
      console.log('SEND_MESSAGE_ERROR');
      return state;

    case Types.ADD_PLAYERS:
      const newPlayers = new OrderedHash({clone: state.players});
      newPlayers.insertMany(action.players, 'username');
      return Object.assign({}, state, {players: newPlayers});

    case Types.REMOVE_PLAYERS:
      const newPlayersRemoved = new OrderedHash({clone: state.players});
      for(let username of action.usernames)
        newPlayersRemoved.remove(username);
      return Object.assign({}, state, {players: newPlayersRemoved});

    case Types.SET_PLAYER_OFFLINE:
      const newPlayersSetOffline = new OrderedHash({clone: state.players});
      console.log(`username: ${action.username}. action: ${JSON.stringify(action)}`);
      newPlayersSetOffline.get(action.username).status = 'OFFLINE';
      return Object.assign({}, state, {players: newPlayersSetOffline});

    case Types.UPDATE_PLAYER:
      const newPlayersSetInGame = new OrderedHash({clone: state.players});
      newPlayersSetInGame.insert(action.player.username, action.player);
      return Object.assign({}, state, {players: newPlayersSetInGame});

    case Types.UPDATE_GAME:
      const gameToUpdate = action.game;
      const gameListAfterUpdate = new OrderedHash({clone: state.gameList});
      gameListAfterUpdate.insert(gameToUpdate.id, gameToUpdate);
      return Object.assign({}, state, {gameList: gameListAfterUpdate});

    case Types.ADD_GAMES:
      const newGameList = new OrderedHash({clone: state.gameList});
      newGameList.insertMany(action.games, 'id');
      return Object.assign({}, state, {gameList: newGameList});

    case Types.REMOVE_GAME:
      const gameListPostRemoval = new OrderedHash({clone: state.gameList});
      if(!(action.game && action.game.id)){
        console.log('Game or Game ID not found');
        return state;
      }
      gameListPostRemoval.remove(action.game.id);
      return Object.assign({}, state, {gameList: gameListPostRemoval});

    case Types.JOINED_LOBBY:
      return Object.assign({}, state, {roomId: action.roomId});

    case Types.LEFT_LOBBY:
    default:
      return state;
  }
}
