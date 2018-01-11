import React from 'react';
import ReactDOM from 'react-dom';

/*Idea's of popup 'hooking' onto elements outside of render tree borrowed from
  https://joecritchley.svbtle.com/portals-in-reactjs
  This class is designed to be a convenient popup which can hook onto any
  element via ReactDOM.render. The the popup will center (vertically and
  horizontally) inside the parent, whilst graying out the background.
  NOTE: The 'hook' element's parent must have position: relative.

  Any subclass must implement renderLayer in place of render.
*/
export default class Dialog extends React.Component {
  constructor(props){
    super(props);
    this.close = this.close.bind(this);
  }

	componentWillUnmount() {
		this._unrenderLayer();
		if(!this.props.root) window.document.body.removeChild(this._target);
	}

	componentDidUpdate() {
		this._renderLayer();
	}

	componentDidMount() {
		if(this.props.root) {
			this._target = window.document.getElementById(this.props.root);
		} else {
			this._target = window.document.createElement('div');
			window.document.body.appendChild(this._target);
		}
		this._renderLayer();
	}

	_renderLayer() {
    const content = this.renderLayer();
    const popupBackground = {
      zIndex: 1000,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center'
    };
    const popup = {
      textAlign: 'center',
      alignSelf: 'center'
    };
		ReactDOM.render(
      <div style={popupBackground}>
        <span style={popup}>
          {content}
        </span>
      </div>,
      this._target);
	}

	_unrenderLayer() {
		ReactDOM.unmountComponentAtNode(this._target);
	}

  close(){
    this._unrenderLayer();
  }

  render() {
    return <span/>;
  }
};
