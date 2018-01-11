import {combineReducers, createStore} from 'redux';
import lobbyReducer from '../reducers/lobbyReducer';

const rootReducer = combineReducers({
  lobby: lobbyReducer
});

function configureStore(initialState){
  return createStore(
    rootReducer,
    initialState
  );
}

const store = configureStore();
export default store;
