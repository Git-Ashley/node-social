import React from 'react';
import {polarToCartesian} from 'math-tools';
import {offsetFromParent} from 'dom-tools';

export default class Avatar extends React.PureComponent {

  constructor(props){
      super(props);

      this.state = {
        coords: []
      };
      this.updateCoords = this.updateCoords.bind(this);
  }

  render(){
    let statusIcon = null;

    if(this.state.coords && this.state.coords.length === 1){

      let color = '#ffffff';
      if(this.props.status === 'ACTIVE')
        color = '#33cc33';
      else if (this.props.status === 'IN_GAME')
        color = '#ee1111';
      else if (this.props.status === 'IDLE')
        color = '#cccc22';
      else if (this.props.status === 'DISCONNECTED')
        color = '#959595';

      const statusIconStyle = {
        position: 'absolute',
        top: this.state.coords[0].y - 6,
        left: this.state.coords[0].x - 6,
        borderWidth: 2 + 'px',
        borderStyle: 'solid',
        borderColor: '#2f3136',
        backgroundColor: color,
        borderRadius: 50 + '%',
        height: 13 + 'px',
        width: 13 + 'px'
      };
      statusIcon = <div alt='avatar' style={statusIconStyle}/>

    }
    return (
      <span style={{position: 'relative'}}>
        <img
          src={this.props.picUrl}
          style={{borderRadius: 100 + 'px'}}
          ref={input => { this.avatarImg = input; }}
          height="30" width="30"/>
        <br/>
        {statusIcon}
      </span>
    );
  }

  updateCoords(){
    const coords = this.getCoords(this.avatarImg, 1);
    this.setState({coords: coords});
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateCoords);
    this.updateCoords();
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.updateCoords);
  }

  // Function which calculates center coordinates of element, relative to
  // the parent, and returns {numItems} coordinates which are positions,
  // {inputSpread}*2*PI radians apart from each other around midTheta, around
  // a circular circumference of {element}, with radius element.width/2.
  getCoords(element, numItems, theta = 0.875, spread = 0.1){

    if(!numItems || !element)
      return null;

    const returnCoords = [];

    // Obtain center of element & radius
    const x0 = offsetFromParent(element).x;
    const y0 = offsetFromParent(element).y;
    const height = element.height;
    const width = element.width;
    const originX = x0 + 0.5*width;
    const originY = y0 + 0.5*height;
    const radius = width/2;

    for(let i = 0; i < numItems; i++){
      const thetaI = (theta + spread*(i + 0.5*(1-numItems)))*2*Math.PI;
      const offsetCoords = polarToCartesian(thetaI, radius);
      returnCoords.push(
        {
          x: originX + offsetCoords.x,
          y: originY - offsetCoords.y
        });
    }

    return returnCoords;

  }
}
