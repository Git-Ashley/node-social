import * as Types from './actionTypes';

export function appStarted(user){
  console.log(`App started with user: ${JSON.stringify(user)}`);
  return {type: Types.APP_STARTED, user};
}
