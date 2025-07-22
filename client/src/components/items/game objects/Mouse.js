import React, { useRef } from "react";
import Draggable from 'react-draggable';
import {SocketContext} from '../../../context/socket';
import "./Mouse.css";
import { detectCollisions } from "./Collisions";

export class Mouse extends React.Component{

    move = (e, data) => {
            //console.log(data)
            const ImportState = this.props.ImportState;
            const state = this.props.state;
           const items = this.props.items;
            let socketClient = this.context;
            ImportState.moving = true;

            const collisions = detectCollisions(ImportState.pos.x, ImportState.pos.y, data.deltaX, data.deltaY, state.size.width, state.size.height, state.ID, items);


        if (collisions.x !== undefined) {
            console.log(collisions);
            if (collisions.x.type === "barrier"){
                data.deltaX = 0;
            }
            if(collisions.x.type === "berry"){
                // delete berry
                socketClient.emit("clientItemRemoved", collisions.x.ID);
            }

        }
        if (collisions.y !== undefined) {
            console.log(collisions);
            if (collisions.y.type === "barrier") {
                data.deltaY = 0;
            }
            if(collisions.y.type === "berry"){
                socketClient.emit("clientItemRemoved", collisions.y.ID);
            }

        }

            ImportState.pos.x += data.deltaX;
            ImportState.pos.y += data.deltaY;

            this.setState(ImportState);
            socketClient.emit("serverPosUpdate", state);

        }

    doneMove = () => {
            const ImportState = this.props.ImportState
            ImportState.moving = false;
            this.setState(ImportState);
        }

    render(){
        //console.log(this.props.ImportState)
        const ImportState = this.props.ImportState
        const state = this.props.state
            return(<Draggable onDrag={(e, data) => this.move(e, data)} onStop={(e, data) => this.doneMove()} position={ImportState.pos}><span className="Draggable" style={{
                width: state.size.width.toString() + 'px',
                height: state.size.height.toString() + 'px',
            }}><img alt="Mouse" src={this.props.imageSrc} width={this.props.state.size.width} height={this.props.state.size.height}/></span></Draggable>)
    }

}

Mouse.contextType = SocketContext;
