import React from "react";
import { Item } from "../items/Item";
import {Anchor} from "../anchorButton/anchor";
import {socket, SocketContext} from '../../context/socket';
import { UserContext} from "../../context/socket";
import detectCollisions from "../items/game objects/Collisions";
import "./canvas.css"

export class Canvas extends React.Component {    
    // Using the canvas's state to track the items on the screen
    // as well as the offset of the user's viewport
    state = {
        items: [],
        offset: {
          x:0,
          y:0
        },
        windowSize: {
          x: window.innerWidth,
          y: window.innerHeight
        }
    };

    constructor (props){
      super(props);

      // Register functions for handling canvas moves, and 
      // edge swipe events
      this.handleChangeX = this.handleChangeX.bind(this);
      this.handleChangeY = this.handleChangeY.bind(this);
      this.onCanvasTouchUp = this.onCanvasTouchUp.bind(this);
      this.onCanvasMouseUp = this.onCanvasMouseUp.bind(this);
    }

    componentDidMount() {
        // Fetch our socketio connection from the provider
        let socketClient = this.context;

      
        // On connection, send our screen width and height
        socketClient.on("connect", () => {
            socketClient.emit("clientConnected", {'x': window.innerWidth, 'y': window.innerHeight});
        });


        // Endpoint for the server to update our offset
        socketClient.on("offsetUpdate", data => {
          // Update our own state with the new offset
          let priorState = this.state;
          priorState.offset.x = parseInt(data.x);
          priorState.offset.y = parseInt(data.y);
          this.setState(priorState);
          socketClient.emit("clientOffsetUpdate", this.state.offset);
          // Update the child items state with the offset
          // this.state.items.forEach(item => {
          //   item[1].offset = priorState.offset;
          // });
        });


        // Update from the server on an item's location
        socketClient.on("posUpdate", data => {    
          // First, loop through the items to see if it exists
          let exists = false;
          this.state.items.forEach(item=> {
            if(String(item[1].ID) === String(data.ID)){
              exists = true;
              // If so, update the item's state
              if(item[1].moving === false){

                const state = {
                  ID: data.ID, 
                  pos: {x: data.pos.x, y: data.pos.y}, 
                  size: {width: data.size.width, height: data.size.height}, 
                  moving: false, 
                  display: true, 
                  type: data.type,
                };
                item[1].pos = state.pos;



                }

          }
          })
    
          // If it doesn't exist, instantiate it
          if(!exists){
            const state = {
                ID: data.ID,
                pos: {x: data.pos.x, y: data.pos.y}, 
                size: {width: data.size.width, 
                height: data.size.height}, 
                moving: false, 
                parentID: this.state.ID, 
                offset: this.state.offset, 
                display: true, 
                type: data.type,
            };
            let item = <Item key={data.ID} newState={state} type = {data.type} items = {this.state.items}></Item>;

            this.state.items.push([item,state]);
          }
          this.forceUpdate();
        });

        // Update from the server to remove an item
        socketClient.on("removeItem", data => {    
          let index = 0;
          let itemToDelete = -1;
  
          this.state.items.forEach(item => {
            if(String(item[1].ID) === String(data.ID)){
              itemToDelete = index;
            }  
            index += 1;
          });

          if(itemToDelete !== -1){

            let priorState = this.state;
            priorState.items[itemToDelete][1].display = false;
            this.setState(priorState);
            console.log("removing item");
            this.state.items.splice(itemToDelete, 1);
          }
        });
      }

      // Event handler to change the offset's current x position
      handleChangeX(event) { 
        console.log(event.target.value);
        this.setState({offset: {x: parseInt(event.target.value), y: this.state.offset.y}});
        let socketClient = this.context;
        socketClient.emit("clientOffsetUpdate", this.state.offset);
        console.log(this.state);
      }

      // Event handler to change the offset's current y position
      handleChangeY(event) { 
        console.log(event.target.value);
        this.setState({offset: {x: this.state.offset.x, y: parseInt(event.target.value)}});
        let socketClient = this.context;
        socketClient.emit("clientOffsetUpdate", this.state.offset);
        console.log(this.state);
      }

      // Check to see if a user swiped towards an edge,
      // If so inform the server of an edge swipe
      onCanvasTouchUp(event) {
        let socketClient = this.context;

        console.log(event['changedTouches'][0]);
    
        if(event['changedTouches'][0]['clientX'] < 300
            || event['changedTouches'][0]['clientX'] > this.state.windowSize.x - 300
            || event['changedTouches'][0]['clientY'] < 300 
            || event['changedTouches'][0]['clientY'] > this.state.windowSize.y - 300){
          console.log('edge swipe!')
          console.log(window.innerHeight);
          console.log("size is", window.innerWidth);
          console.log(this.state.windowSize.x);
          socketClient.emit("clientEdgeSwipe", {"x": event['changedTouches'][0]['clientX'], "y": event['changedTouches'][0]['clientY']});
        }
      }

      // Check to see if a user moused towards an edge,
      // If so inform the server of an edge swipe
      onCanvasMouseUp(event) {
        let socketClient = this.context;

        console.log(event);

        socketClient.emit("clientEdgeSwipe", {"x": event.clientX, "y": event.clientY});
      }
    
      render () {
        return(
            <div id="canvas" onTouchEnd={this.onCanvasTouchUp} onMouseLeave={this.onCanvasMouseUp}>
              {/* <input type="number" value={this.state.offset.x} onChange={this.handleChangeX} />
              <input type="number" value={this.state.offset.y} onChange={this.handleChangeY} /> */}
              <UserContext.Consumer>{user => (<Anchor user = {user}/>)}</UserContext.Consumer>
              <br></br>
                {this.state.items.map(item => { // tracked in context, function tht returns back items and their equivalent states s
                    return(item[0]);
                })}


                 
            </div>
          );
        }
}
Canvas.contextType = SocketContext;