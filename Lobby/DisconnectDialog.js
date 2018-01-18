import React from 'react';
import BaseDialog from '@lib/Dialogs/base';

export default class extends BaseDialog {
  constructor(root){
    const component = () => (<div style={{color: 'white'}}>Disconnected. Attepmting to reconnect...</div>);
    super(component, root);
  }

  close(){
    this._close();
  }
}
