const { v4: uuidv4 } = require('uuid');
const { debug } = require("console");
const express = require("express");
const http = require("http");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

// Update interval for the app, runs every 1/10th of a second
let interval = setInterval(() => getApiAndEmit(NaN), 100);

// Keep track of the number of users connected
let displayNum = 0;

// List of connected users
let users = [];

// List of unsnapped devices connected
let unsnapped = [];

// List of items in the scene
let items = [];

// List of edge swipes stored by the users
let swipes = [];

// List of connected devices
let connections = [];

// List of anchored devices
let anchored = new Set([]);

let mouse = {
  "ID": uuidv4(),
  "pos": {"x": 370, "y": 220},
  "size": {"width": 150, "height": 150},
  "type": "mouse"
}
items.push(mouse);

let flag = {
  "ID": uuidv4(),
  "pos": {"x": 5500, "y": 2230},
  "size": {"width": 150, "height": 200},
  "type": "flag"
}
items.push(flag);

//            x1y1,       x1y2,       x1y3,       x2y1         x2y3      x3y1         x3y2          x3y2      x4y1
berryPos = [[1160,250],[1330, 1500],[390,2150],[2600, 350],[2100, 2160],[4300,400],[3500,1500],[4300,1520],[5200,370]];
for(let i = 0; i < berryPos.length; i++){
  let berry = {
    "ID": uuidv4(),
    "pos": {"x": berryPos[i][0], "y": berryPos[i][1]},
    "size": {"width": 125, "height": 125},
    "type": "berry",
  }
  items.push(berry);
}


// order
// x1y1
// x1y2
// x1y3

// x2y1
// x2y2
// x2y3

// x3y1
// x3y2
// x3y3

// x4y1
// x4y2

barrierPos = 
[[0,0],[720,200],[350,0],[520,400],[1320,400],
[350,1210],[550,1550],[1010,1220],[1280,1210],
[350,2320],[820,1680],

[2100,200],[2100,520],[2550,200],[2950,200],
[2170,1210],[2480,1440],[2750,1440],
[1490,1710],[1490,2120],[2740,2450],[2980,1700],

[3490,200],[3740,560],[4470,320],
[4240,1250],
[4480,1680],

[5060,520],[5460,600],[5680,320],
[5400,1240],[5880,1470],
[5240,2180]

];
barrierSize = 
  [[350,2592],[350,200],[5790,200],[620,570],[540,580],
  [470,340],[270,500],[270,830],[630,230],
  [2390,250],[200,370],

  [450,320],[630,450],[400,120],[540,770],
  [1260,230],[270,620],[680,60],
  [770,420],[580,220],[3300, 125],[480,530],

  [2650,110],[500,1650],[370,690],
  [850,210],
  [1180, 550],

  [400,500],[200,420],[450,1150],
  [300,230],[250,1100],
  [220,300]

];
for(let i = 0; i < barrierPos.length; i++){
  let barrier = {
    "ID": uuidv4(),
    "pos": {"x": barrierPos[i][0], "y": barrierPos[i][1]},
    "size": {"width": barrierSize[i][0], "height": barrierSize[i][1]},
    "type": "barrier",
  }
  items.push(barrier);
}


let map = {
  "ID": uuidv4(),
  "pos": {"x": 0, "y": 0},
  "size": {"width": 1536 * 4, "height": 864 * 3},
  "type": "map"
}
items.push(map);



// Endpoint for users to connect to
io.on("connection", (socket) => {
  // Generate a random ID for the user
  let ID = Math.floor(Math.random() * 10000);
  displayNum+= 1;

  console.log("New client connected");

// When a client disconnects, find it in the list and remove it
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    let i = 0;
    let indexToDelete = -1; 
    let user = null;

    users.forEach(element => {
      if(element['Socket'] === socket){
        user = element;
        indexToDelete = i;
      }
      i += 1;
    });

    if(user !== null){
      console.log("Client disconnected!!!");
      displayNum-= 1;
      users.splice(indexToDelete, 1);
      console.log(users);
      console.log("index: %d", indexToDelete);
      unsnapped.splice(indexToDelete-1);
    }
  });

  // When the client confirms their connection, log their screen
  // size and update their position
  socket.on("clientConnected", size => {
    data = {};
    data['ID'] = ID;
    data['Socket'] = socket;
    data['Size'] = size;
    idInUsers = false;

    offset = {'x': 0, 'y':0};

    users.forEach(element => {
      if (element.ID === ID){
        idInUsers = true;
      }
      else{
        offset['x'] += element['Size']['x'];
      }
    });

    if (!idInUsers){
      console.log(ID);
      socket.emit("userInfo", ID);
      data['Offset'] = offset;
      users.push(data);
      // Make all screens start as unsnapped except for first.
      if (users.length > 1){
        socket.emit("unSnap", ID);
        unsnapped.push(data);
      }
      else{
        socket.emit("offsetUpdate", offset);
      }

    }
  });

  // Process a client's offset update
  socket.on("clientOffsetUpdate", offset => {
    users.forEach(element => {
      if(element['Socket'] === socket){
        element['Offset'] = offset;
        socket.emit("Snapped", element['ID']);
      }
    });
  }); 


  // User update on an items position. If the item still exists
  // update it's location
  socket.on("serverPosUpdate", itemUpdate => {
    users.forEach(user => {
      if(user['Socket'] === socket){
        items.forEach(function(item, index) { 
          if(item.ID === itemUpdate.ID){
            //console.log(user['Offset'])
            itemUpdate.pos.x += user['Offset']['x'];
            itemUpdate.pos.y += user['Offset']['y'];
            items[index].pos = itemUpdate.pos;
            //console.log(item.pos);
          }
        });
    }
  });
  });


  // See which user's screen gets anchored
  socket.on("Anchored", user => {
    users.forEach(element => {
      if (element.ID === user){
      // Check its not already connected to an anchor:
      if (connections.forEach(devices =>{
        devices[0]['user']['ID'] === user.ID && anchored.has(devices[1]['user']['ID'])||
        devices[1]['user']['ID'] === user.ID && anchored.has(devices[0]['user']['ID'])
      })){
          socket.emit("cantAnchor", user);
        }
      // If it's not, set as anchor
      else{
      anchored.add(user);
      }
      };
      });
    });


  // When a client un-anchors the screen
  socket.on("unAnchored", user => {
      if (users.some(device => device.ID === user)){
        anchored.delete(user);
      }
  });



  socket.on("clientItemRemoved", itemID => {
    items.forEach(function(item, index){
      if(item.ID === itemID){
        items.splice(index, 1);
        console.log("removing Item");
        socket.emit("removeItem", {"ID": itemID})
      }
    })
  });

  // If a client swipes on an edge, update the swipes list
  // With the location of the swipe and side of the screen
  socket.on("clientEdgeSwipe", swipePos => {
    users.forEach(user => {
      if(user['Socket'] === socket){
        let type = []; 
        console.log(swipePos);
        swipePos['x'] += user['Offset']['x'];
        swipePos['y'] += user['Offset']['y'];
        // only register swipes that aren't mouse moves
        const isMouse = (item) => item['type'] == "mouse";
        let mouseIndex = items.findIndex(isMouse);
        if((items[mouseIndex]['pos']['x'] <= swipePos['x'] && swipePos['x'] <= items[mouseIndex]['pos']['x']+items[mouseIndex]['size']['width']
        && items[mouseIndex]['pos']['y'] <= swipePos['y'] && swipePos['y'] <= items[mouseIndex]['pos']['y'] + items[mouseIndex]['size']['height']) === false){

          if(swipePos['x'] >= user['Offset']['x'] - 10 && swipePos['x'] <= user['Offset']['x'] + 10){
            type[0] = "left";
            type[1] = "snap";
        }
          else if(swipePos['x'] >= user['Offset']['x'] - 300 && swipePos['x'] <= user['Offset']['x'] + 200){
            type[0] = "left";
            type[1] = "unsnap";
      }
          else if(swipePos['x'] >= user['Offset']['x'] + user['Size']['x'] - 10 && swipePos['x'] <= user['Offset']['x'] + user['Size']['x'] + 10){
            type[0]= "right";
            type[1] = "snap";
          }
          else if(swipePos['x'] >= user['Offset']['x'] + user['Size']['x'] - 300 && swipePos['x'] <= user['Offset']['x'] + user['Size']['x'] + 200){
            type[0]= "right";
            type[1] = "unsnap";
          }
          else if(swipePos['y'] >= user['Offset']['y'] - 50 && swipePos['y'] <= user['Offset']['y'] + 50){
              type[0] = "top";
              type[1] = "snap";
          }
          else if(swipePos['y'] >= user['Offset']['y'] - 300 && swipePos['y'] <= user['Offset']['y'] + 200){
            type[0] = "top";
            type[1] = "unsnap";
          }
          else if(swipePos['y'] >= user['Offset']['y'] + user['Size']['y'] - 50 && swipePos['y'] <= user['Offset']['y'] + user['Size']['y'] + 50){
            type[0] = "bottom";
            type[1] = "snap";
          }
            else if(swipePos['y'] >= user['Offset']['y'] + user['Size']['y'] - 300 && swipePos['y'] <= user['Offset']['y'] + user['Size']['y'] + 200){
              type[0] = "bottom";
              type[1] = "unsnap";
          }


        let swipeInfo = {'x': swipePos['x'] + user['Offset']['x'], 'y': swipePos['y'] + user['Offset']['y'], "user": user, 'time': Date.now(), "type": type}
        swipes.push(swipeInfo);
        console.log(swipeInfo);
      }
      }
    });
  });
});

// Core loop of the app
const getApiAndEmit = socket => {
  // Loop through each user and item and see if they collide
  // If so, update the user with info of of the items location
  // Else, tell the user to remove that item
  users.forEach(user => {
    if(!unsnapped.includes(user)){
    items.forEach(item => {
      if(item['pos']['x'] <= user['Offset']['x'] + user['Size']['x'] &&
      item['pos']['x'] + item['size']['width'] >= user['Offset']['x'] &&
      item['pos']['y'] <= user['Offset']['y'] + user['Size']['y'] && 
      item['pos']['y'] + item['size']['height'] >= user['Offset']['y'])
      {
        normalizedLocation = JSON.parse(JSON.stringify(item['pos']));
        normalizedLocation['x'] -= user['Offset']['x'];
        normalizedLocation['y'] -= user['Offset']['y'];
        user['Socket'].emit("posUpdate", {"ID": item['ID'],"pos":normalizedLocation, "size": item['size'], "type":item['type']});
        // anchor the screen with the item (if it is fully in the screen)
        if(item['type'] === "mouse" &&
        item['pos']['x']>= user['Offset']['x'] && 
        item['pos']['x'] + item['size']['width'] <= user['Offset']['x'] + user['Size']['x'] &&
        item['pos']['y'] >= user['Offset']['y'] &&
        item['pos']['y'] + item['size']['height'] <= user['Offset']['y'] + user['Size']['y']
        ){
        user['Socket'].emit("clientAnchored", user['ID']);
        }
      }
      else{
        user['Socket'].emit("removeItem",{"ID": item['ID']});
        // unanchor the screen where the item left from
        if(item['type'] === "mouse"){
        user['Socket'].emit("clientUnAnchored", user['ID']);
        }
      }
    });
  }
  });

  // Remove any swipes older than a second
  let currTime = Date.now();
  swipes = swipes.filter(swipe => swipe['time'] + 1000 > currTime);

  const handleMove = (swipe1, swipe2) => {
    console.log(anchored);
    let movedDevice;
    let anchoredDevice;
    // swipe1 is unsnapped and wants to connect to swipe2
    if(unsnapped.some(device => device['ID'] === swipe1['user']['ID']) ){
      movedDevice = swipe1;
      anchoredDevice = swipe2;
    }
    // swipe2 is unsnapped and wants to connect to swipe 1
    else if(unsnapped.some(device => device['ID'] === swipe2['user']['ID'])){
      movedDevice = swipe2;
      anchoredDevice = swipe1;
    }
    // Both are conneted and want to reorient
    // Check anchors
    else{
         if(anchored.has(swipe1['user']['ID']) && anchored.has(swipe2['user']['ID'])){
        // Throw error, you cannot snap two devices that are both anchors together
      }
      else if(anchored.has(swipe1['user']['ID'])){ 
          movedDevice = swipe2;
          anchoredDevice = swipe1;
      }
      else if(anchored.has(swipe2['user']['ID'])){
          movedDevice = swipe1;
          anchoredDevice = swipe2;
    }
  }
    return [movedDevice, anchoredDevice];
}

  // Snapping logic:
  const snapFunc = (swipe1, swipe2) => {
    // Boolean to see if connections are valid
    let connected = false;
    let [movedDevice, anchoredDevice] = handleMove(swipe1, swipe2);
      // Get type and snap
    if(movedDevice !== undefined && anchoredDevice !== undefined){
      if(movedDevice['type'][0] === "left" && anchoredDevice['type'][0] === "right"){
        let newOffset = {
                "x": anchoredDevice['user']['Offset']['x'] + anchoredDevice['user']['Size']['x'], 
                "y": anchoredDevice['user']['Offset']['y'], 
        }      
        connected = true;
        console.log(newOffset);
        movedDevice['user']['Socket'].emit("offsetUpdate", newOffset);
      }
      else if(movedDevice['type'][0] === "right" && anchoredDevice['type'][0] === "left"){
        let newOffset = {
                "x": anchoredDevice['user']['Offset']['x'] - movedDevice['user']['Size']['x'], 
                "y": anchoredDevice['user']['Offset']['y'],
        }      
        connected = true;
        console.log(newOffset);
        movedDevice['user']['Socket'].emit("offsetUpdate", newOffset);
      }
      else if(movedDevice['type'][0] === "top" && anchoredDevice['type'][0] === "bottom"){
        let newOffset = {
                "x": anchoredDevice['user']['Offset']['x'], 
                "y": anchoredDevice['user']['Offset']['y'] + anchoredDevice['user']['Size']['y'],
        }      
        connected = true;
        console.log(newOffset);
        movedDevice['user']['Socket'].emit("offsetUpdate", newOffset);
      }
      else if(movedDevice['type'][0] === "bottom" && anchoredDevice['type'][0] === "top"){
        let newOffset = {
                "x": anchoredDevice['user']['Offset']['x'], 
                "y": anchoredDevice['user']['Offset']['y'] - movedDevice['user']['Size']['y'],
        }      
        connected = true;
        console.log(newOffset);
        movedDevice['user']['Socket'].emit("offsetUpdate", newOffset);
      }
    }
    if (connected == true){
      let devices = [swipe1, swipe2];
      connections.push(devices);
      console.log("snap!");
      // remove from unsnap array, because it is going to be connected
      if(unsnapped.findIndex(device => device['ID'] === swipe1['user']['ID']) != -1){
        let index = unsnapped.findIndex(device => device['ID'] === swipe1['user']['ID'])
        unsnapped.splice(index,1);
      }
      else if(unsnapped.findIndex(device => device['ID'] == swipe2['user']['ID']) != -1){
        let index = unsnapped.findIndex(device => device['ID'] === swipe2['user']['ID'])
        unsnapped.splice(index,1);
    
      }
    

    }
  }
  
  const checkConnections = (swipe1, swipe2) =>{
    let connectionsCount1 = 0;
    let connectionsCount2 = 0;
    connections.forEach(devices =>{
      devices.forEach(device=>{
        if(swipe1['user']['ID'] === device['user']['ID']){
          connectionsCount1 ++;
        }
        if(swipe2['user']['ID'] === device['user']['ID']){
          connectionsCount2 ++;
        }
      });
    });
    if(connectionsCount1 > connectionsCount2){
      return swipe1;
    }
    if(connectionsCount1 < connectionsCount2){
      return swipe2;
    }
    return null;
}


  // If there are only two swipes, move a canvas to connect the two
  if(swipes.length == 2){
    // Check to see if the two swipes are in valid positions 
    // (top / bottom, bottom / top, left / right, right / left)
    if(swipes[0]['type'][0] === "left" && swipes[1]['type'][0] === "right"||
    swipes[1]['type'][0] === "left" && swipes[0]['type'][0] === "right"||
    swipes[0]['type'][0] === "top" && swipes[1]['type'][0] === "bottom"||
    swipes[1]['type'][0] === "top" && swipes[0]['type'][0] === "bottom"){
    // Once you find a match, collision check to see if the swiped connection
    // will fit (saving this for later, since the physical space should do this job)

          // check if unsnap 
          if(swipes[0]['type'][1] == "unsnap" && swipes[1]['type'][1] == "unsnap"){
        // loop through connections array to see if the swipes match up
            if(connections.length != 0){
              connections.forEach((devices,index) =>{
          // check if swipes match where the screens are connected
                if(swipes[0]['type'][0] === devices[0]['type'][0] && swipes[1]['type'][0] === devices[1]['type'][0] &&
                swipes[0]['user']['ID'] === devices[0]['user']['ID'] && swipes[1]['user']['ID'] === devices[1]['user']['ID']||
                swipes[1]['type'][0] === devices[0]['type'][0] && swipes[0]['type'][0] === devices[1]['type'][0] &&
                swipes[1]['user']['ID'] === devices[0]['user']['ID'] && swipes[0]['user']['ID'] === devices[1]['user']['ID']){
          // Decide which screen to unsnap:
          // Check if an anchor:
            // swipe 0 is anchor
                      if(anchored.has(swipes[0]['user']['ID'])){
                        swipes[1]['user']['Socket'].emit("unSnap", swipes[1]['user']['ID']);
                        unsnapped.push(swipes[1]['user']);
                      }
                      // swipe 1 is anchor
                      else if(anchored.has(swipes[1]['user']['ID'])){
                        swipes[0]['user']['Socket'].emit("unSnap", swipes[0]['user']['ID']);
                        unsnapped.push(swipes[0]['user']);
                      }
            // Neither are anchors
                      else{
                        // check which one has more connections
                        if(checkConnections(swipes[0],swipes[1]) === swipes[0]){
                          swipes[1]['user']['Socket'].emit("unSnap", swipes[1]['user']['ID']);
                          unsnapped.push(swipes[1]['user']);
                        }
                        if(checkConnections(swipes[0],swipes[1]) === swipes[1]){
                          swipes[0]['user']['Socket'].emit("unSnap", swipes[0]['user']['ID']);
                          unsnapped.push(swipes[0]['user']);
                        }
                        if(checkConnections(swipes[0],swipes[1]) === null){
                        // check which tablet is closer to the anchor
                        // * Not done Yet **

                        swipes[1]['user']['Socket'].emit("unSnap", swipes[1]['user']['ID']);
                        unsnapped.push(swipes[1]['user']);
                        }
                      }
                      connections.splice(index, 1);
          }
        
           });
        }
        swipes.splice(0,2);
      }
      else if(swipes[0]['type'][1] === "snap" && swipes[1]['type'][1] === "snap"){
        // check if reorienting screens
        if(connections.length != 0){
          connections.forEach((devices,index) =>{
            if(swipes[0]['type'][0] === devices[0]['type'][0] && swipes[1]['type'][0] === devices[1]['type'][0] &&
            swipes[0]['user']['ID'] === devices[0]['user']['ID'] && swipes[1]['user']['ID'] === devices[1]['user']['ID']||
            swipes[1]['type'][0] === devices[0]['type'][0] && swipes[0]['type'][0] === devices[1]['type'][0] &&
            swipes[1]['user']['ID'] === devices[0]['user']['ID'] && swipes[0]['user']['ID'] === devices[1]['user']['ID']){
              connections.splice(index, 1);
            }
          });
        }
            snapFunc(swipes[0],swipes[1]);
            swipes.splice(0,2);
        }
        }
      }



};


server.listen(port, () => console.log(`Listening on port ${port}`));