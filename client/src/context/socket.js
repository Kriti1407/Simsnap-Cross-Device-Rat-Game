import React, { createContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://10.0.1.27:4001"; 

// export const socket = socketio.connect(ENDPOINT);
// export const SocketContext = React.createContext();

export const socket = socketIOClient(ENDPOINT);
export const SocketContext = createContext(socket);

export const UserContext= createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    socket.on("userInfo", (data) => {
        console.log(data);
        setUser({data});
      });
  }, [user]);

  console.log(user);

    return (
      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
    );
  };
