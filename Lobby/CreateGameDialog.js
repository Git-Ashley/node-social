import React from 'react';
import Dialog from '../utils/Dialog';
import button from '@styles/button.css';
import TextField from '@lib/TextField';
import text from '@styles/text.css';

export default class CreateGameDialog extends Dialog {

	constructor(props){
		super(props);

		this.state = {
			name: ""
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(){
		this.props.onSubmit(this.state);
		this.close();
	}

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
				<div className={text.subTitle}>Create Game</div>
				<TextField type="text" onChange={e => this.setState({name: e.target.value})} name="Name" value={this.state.name}/>
				<div style={{marginTop: '5px'}}>
					<span style={{marginRight: '5px'}} className={button.regular} onClick={this.handleSubmit}>
						Submit
					</span>
					<span style={{marginLeft: '5px'}} className={button.regular} onClick={this.close}>
						Cancel
					</span>
				</div>
			</div>
		);
	}
};
