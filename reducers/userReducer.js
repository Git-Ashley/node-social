import * as Types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.user, action){

  switch(action.type){
    case Types.APP_STARTED:
      return action.user;

    default:
      return state;
  }
}
