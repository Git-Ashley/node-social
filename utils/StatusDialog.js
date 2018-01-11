import React from 'react';
import Dialog from './Dialog';
import button from '@styles/button.css';
import text from '@styles/text.css';

export default class StatusDialog extends Dialog {

	close(){
		this.props.onClose();
		super.close();
	}

    // Note the lack of render method, as that is applied from the mixin. Use `renderLayer` as your replacement.
	renderLayer() {

		const backgroundStyles = {
			backgroundColor: '#777777',
			padding: '10px',
			borderRadius: '5px'
		};

		return (
			<div style={backgroundStyles}>
				{this.props.title ?
					<div className={text.subTitle}>{this.props.title}</div> : null
				}
				<div className={text.regular}>{this.props.text}</div>
				<div style={{marginLeft: '5px', marginTop: '10px'}} className={button.regular} onClick={this.close}>
					OK
				</div>
			</div>
		);
	}
};
