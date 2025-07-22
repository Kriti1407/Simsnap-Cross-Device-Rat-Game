import React, { useRef } from "react";
import {SocketContext} from '../../../context/socket';
import "./Berry.css";
import { detectCollisions } from "./Collisions";

export class Berry extends React.Component{
    constructor(props){
        super(props);
        this.ImportState = props.ImportState
        this.state = props.state;
        this.items = props.items
    }


    render(){
        return(
        <span>
             <img className="Berry"src={this.props.imageSrc} width={this.state.size.width} height={this.state.size.height} style ={{transform: `translate(${this.ImportState.pos.x}px, ${this.ImportState.pos.y}px)`}}/>
        </span>
        )
    }

}

Berry.contextType = SocketContext