import React from 'react';
import chat from './Chat.css';
import scrollbar from '@styles/scrollbar.css';
import Avatar from './Avatar';
import button from '@styles/button.css';
/*
<span class="all">
    <span class="group-1">
      <input type="text" placeholder="b" />
    </span>
    <span class="group-2">
      <span class="a">A</span>
    </span>
</span>*/

/*
<div className={chat.sendForm}>
  <button className={chat.sendBtn} type="button" onClick={props.onSendMessage}>Send</button>
  <input type="text" className={chat.input} onKeyDown={e => {if(e.keyCode == 13) props.onSendMessage()}} onChange={props.onSendTextChange} value={props.sendText}/>
</div>
*/

const PlayerItem = ({player}) => (
  <div className={chat.playerListItem}>
    <Avatar picUrl={player.picUrl} status={player.status}/>
    <span className={chat.playerListName}>{player.username}</span>
  </div>
);

const ChatMessage = ({player, message}) => (
  <div className={chat.messageContainer}>
    <img alt="profile pic" className={chat.messageImage}
      src={player.picUrl}/>
    <span>
      <span className={chat.messageUsername}>{player.username}</span>
      {
        message.text.constructor === Array ?
          message.text.map((line, index) => <div key={line.concat(index)}>{line}</div>)
          : <div>{message.text}</div>
      }
    </span>
  </div>
);

export default class extends React.Component {
  render(){
    let lastPoster = null;
    let chatMessages = [];
    for(let msg of this.props.chatMessages){
      if(lastPoster === msg.username){
        let lastMsg = chatMessages.pop();
        let revisedMsg = null;
        if(lastMsg.text.constructor === Array){
          revisedMsg = lastMsg;
          revisedMsg.text.push(msg.text);
        } else {
          revisedMsg = Object.assign({}, lastMsg, {text: [lastMsg.text, msg.text]});
        }
        chatMessages.push(revisedMsg);
      } else {
        chatMessages.push(msg);
      }
      lastPoster = msg.username;
    }

    return (
      <div className={chat.main}>
        <div className={chat.flexContainer}>
          <div className={chat.outputInputContainer}>
            <div className={`${chat.output} ${scrollbar.dark1}`} ref={el => { this.chatBody = el; }}>
              {
                chatMessages.map(msg => <ChatMessage key={msg.id} player={this.props.players.get(msg.username)} message={msg}/>)
              }
            </div>
            <span className={chat.sendForm}>
              <input type="text" className={chat.input} onKeyDown={e => {if(e.keyCode === 13) this.props.onSendMessage()}} onChange={this.props.onSendTextChange} value={this.props.sendText} />
              <span className={`${button.bordered} ${button.blue}`} onClick={this.props.onSendMessage}>Send</span>
            </span>

          </div>
          <div className={`${chat.userList} ${scrollbar.dark1}`} style={{position: 'relative'}}>
            {
              this.props.players.map(player => player.status !== 'OFFLINE' ? <PlayerItem key={player.username} player={player}/> : null)
            }
          </div>
        </div>
      </div>
    );
  }
  componentDidUpdate(){
    this.chatBody.scrollTop = this.chatBody.scrollHeight - this.chatBody.clientHeight;
  }
}
