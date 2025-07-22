import React from "react";
import { Canvas } from "./components/canvas/canvas";
import {UnSnapScreen} from "./components/unsnap_screen/UnsnapScreen";
import {SocketContext, socket} from './context/socket';
import {UserContext, UserProvider} from "./context/socket";
import './App.css';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unSnap: false,  
    }
  }
  componentDidMount(){
    let socketClient = this.context;
    socketClient.on("Snapped", () =>{
      this.setState({unSnap: false});
    });
    socketClient.on("unSnap", () =>{
      this.setState({unSnap: true});
    });
  }

  render() {
    console.log(this.state.unSnap);
    if(this.state.unSnap == true){
      return (<SocketContext.Provider value={socket}> <UserProvider><UnSnapScreen/></UserProvider></SocketContext.Provider>);
      }
    else{
      // return (<SocketContext.Provider value={socket}><UserContext.Consumer>{user =>(<Canvas user = {user}/>)}</UserContext.Consumer></SocketContext.Provider>);
      return (<SocketContext.Provider value={socket}><UserProvider><Canvas/></UserProvider></SocketContext.Provider>);
    }
    
  }
}

App.contextType = SocketContext;