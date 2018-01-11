import OrderedHash from '@lib/OrderedHash';

export default {
  lobby: {
    chatMessages: [], //{id, username, timestamp (ISO), text, group}
    players: new OrderedHash(), //{username: user}
    gameList: new OrderedHash(),
    roomId: null
  },
  user: null
};
