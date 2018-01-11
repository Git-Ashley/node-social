import * as Types from './actionTypes';

export function createGame(){
  return {type: Types.CREATE_GAME};
}

export function joinGameError(error){
  return {type: Types.JOIN_GAME_ERROR, error};
}

export function leftLobby(){
  return {type: Types.LEFT_LOBBY};
}

export function updatePlayer(player){
  return {type: Types.UPDATE_PLAYER, player};
}

export function addGames(games){
  return {type: Types.ADD_GAMES, games};
}

export function removeGame(game){
  return {type: Types.REMOVE_GAME, game};
}

export function updateGame(game){
  return {type: Types.UPDATE_GAME, game};
}

export function joinedLobby(roomId){
  return {type: Types.JOINED_LOBBY, roomId};
}
