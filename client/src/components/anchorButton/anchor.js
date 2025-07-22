import "./anchor.css";
import React from "react"
import Switch from "react-switch";
import {socket, SocketContext} from '../../context/socket';
import {UserContext} from "../../context/socket";

export class Anchor extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        checked: false, 
        uncheckedIcon: false,
        checkedIcon: false,
        onColor: "#00c2db" };
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
      let socketClient = this.context;
      socketClient.on("cantAnchor", () =>{
        console.log("can't Anchor");
        this.setState({checked: false});
      });

      socketClient.on("clientAnchored", (data) =>{
        this.setState({checked: true});
        socketClient.emit("Anchored", data);
     });
      socketClient.on("clientUnAnchored", (data) =>{
        this.setState({checked: false});
        socketClient.emit("unAnchored", data);
     });
    }

    handleChange = (checked) =>{
        let socketClient = this.context;
        this.setState({checked});
        console.log(this.props.user);
        if(checked){
            socketClient.emit("Anchored", this.props.user);
        }    
        if(!checked){
            socketClient.emit("unAnchored", this.props.user);
        }    
    }

    render(){
    return(
        <label>
        <span className="Label">Anchor </span>
        <Switch className="Anchor" onChange={this.handleChange} checked={this.state.checked} uncheckedIcon={this.state.uncheckedIcon} 
        checkedIcon={this.state.checkedIcon} onColor={this.state.onColor} />
      </label>
    )
    }
}
 Anchor.contextType = SocketContext


