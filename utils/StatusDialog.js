import React from 'react';
import BaseDialog from '@lib/Dialogs/base';
import button from '@styles/button.css';
import text from '@styles/text.css';

const backgroundStyles = {
	backgroundColor: '#777777',
	padding: '10px',
	borderRadius: '5px'
};

export default class StatusDialog extends BaseDialog {
	constructor(root, {title, text}){
		const component = props => (<div style={backgroundStyles}>
				{title ?
					<div className={text.subTitle}>{title}</div> : null
				}
				<div className={text.regular}>{text}</div>
				<div style={{marginLeft: '5px', marginTop: '10px'}} className={button.regular} onClick={this._close}>
					OK
				</div>
			</div>);
		super(component, root);
	}
};
