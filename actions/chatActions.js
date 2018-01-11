import * as Types from './actionTypes';

export function addMessage(message){
  return {type: Types.ADD_MESSAGE, message};
}

function sendMessageError(msgId){
  return {type: Types.SEND_MESSAGE_ERROR};
}

export function addPlayers(players){
  return ({type: Types.ADD_PLAYERS, players});
}

export function removePlayers(usernames){
  return ({type: Types.REMOVE_PLAYERS, usernames});
}

export function setPlayerOffline(username){
  return ({type: Types.SET_PLAYER_OFFLINE, username});
}
