import React, { useRef, useEffect } from "react";
import Draggable from 'react-draggable';
import {SocketContext} from '../../context/socket';
import { Mouse} from "./game objects/Mouse";
import {Barrier} from "./game objects/Barriers";
import { Berry } from "./game objects/Berry";
import "./Item.css";

export class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.newState;
        this.ImportState = props.newState;
        this.type = props.newState.type;
        this.items = props.items;
    }
    
    componentWillReceiveProps(props) {
        this.setState(props.newState);
    }


    componentDidMount() {
        this.interval = setInterval(() => this.setState(this.ImportState), 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        //console.log(this.ImportState);
        if(this.state.display){
            if(this.type === "map"){
                return(
                    <img className = "Map" alt = "map" src = "/Map.png" width = {this.state.size.width} height = {this.state.size.height}
                    style ={{transform: `translate(${this.ImportState.pos.x}px, ${this.ImportState.pos.y}px)`}}></img> 
                )
            }
            else if(this.type === "flag"){
                return(
                    <img  className = "Flag" alt = "flag" src = "/finalFlag.png" width = {this.state.size.width} height = {this.state.size.height}
                    style ={{transform: `translate(${this.ImportState.pos.x}px, ${this.ImportState.pos.y}px)`}}></img> 
                )
            }
            else if(this.type === "mouse"){
            return(
            <Mouse state = {this.state} ImportState = {this.ImportState} imageSrc= "/Mouse.png" items = {this.items} 
            ></Mouse>
            )
            }
            else if(this.type === "barrier"){
            return (
            <Barrier state = {this.state} ImportState = {this.ImportState}></Barrier>
            )
            }
            else if(this.type === "berry"){
            return (
                <Berry state = {this.state} ImportState = {this.ImportState} imageSrc = "/Berries.png" ></Berry>
            )
            }
       }
        else{
            console.log("not rendering");
            return(null);
        }
    }
}
Item.contextType = SocketContext;