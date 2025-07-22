import React from "react";
import "./UnsnapScreen.css";
import {socket, SocketContext} from '../../context/socket';


export class UnSnapScreen extends React.Component {
    constructor(props){
        super(props);
        this.onCanvasTouchUp = this.onCanvasTouchUp.bind(this);
        this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
    }

    onCanvasMouseUp(event) {
        let socketClient = this.context;

        console.log(event);

        socketClient.emit("clientEdgeSwipe", {"x": event.clientX, "y": event.clientY});
      }


    onCanvasTouchUp(event) {
        let socketClient = this.context;

        console.log(event);

        if(event['changedTouches'][0]['clientX'] < 10 
            || event['changedTouches'][0]['clientX'] > window.innerWidth - 10
            || event['changedTouches'][0]['clientY'] < 10 
            || event['changedTouches'][0]['clientY'] > window.innerHeight - 10){
          console.log('edge swipe!')
          socketClient.emit("clientEdgeSwipe", {"x": event['changedTouches'][0]['clientX'], "y": event['changedTouches'][0]['clientY']});
        }
      }

render(){
    return (
        <div id="canvas" onTouchEnd={this.onCanvasTouchUp} onMouseLeave={this.onCanvasMouseUp} >
            <img className="UnsnapScreen" alt = "unsnap" src = "/UnsnapScreen.gif" width = {window.innerWidth} height = {window.innerHeight}></img> 
        </div>
);
    }
    }

UnSnapScreen.contextType = SocketContext;

