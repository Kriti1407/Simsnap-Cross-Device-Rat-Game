import React, { useRef } from "react";
import Draggable from 'react-draggable';
import {SocketContext} from '../../../context/socket';
import "./Barriers.css";

export class Barrier extends React.Component{
    constructor(props){
        super(props);
        this.ImportState = props.ImportState;
        this.state = props.state;
    }

    render(){
        return(
        <span>
         <img
              className="Barrier"
              style={{
                width: this.state.size.width + 'px',
                height: this.state.size.height + 'px',
                transform: `translate(${this.state.pos.x}px, ${this.state.pos.y}px)`,
              }}
            ></img>
            </span>
        )
    }

}

Barrier.contextType = SocketContext
