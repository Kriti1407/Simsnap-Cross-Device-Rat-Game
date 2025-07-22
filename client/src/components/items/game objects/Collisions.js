

export const detectCollisions = (x, y, dx, dy, w, h, ID, items) => {
    if (items.length == 0) return { x: undefined, y: undefined }
  
    //console.log("INTIAL PARAMS", x, y, dx, dy, w, h)
  
    let fx = x;
    let fy = y;
    if(dx > 0)
      fx += w;
    if (dy > 0) 
      fy += h;
  
    const within = (a, b, x1, y1, x2, y2) => {
      // console.log("WITHIN", Math.round(a), Math.round(b), Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2), x1 <= a && a <= x2 && y1 <= b && b <= y2)
      return x1 <= a && a <= x2 && y1 <= b && b <= y2;
    }
  
    // objects that are being collided with
    let xcol = undefined;
    let ycol = undefined;
  
    // TODO: keep a list of collisions
    // let collisions = [];
  
    for (let i = 0; i < items.length; i++) {
      if (xcol !== undefined && ycol !== undefined) 
        return {
          x: xcol,
          y: ycol,
        }
  
      let currentItem = items[i][1];
      if (currentItem.ID === ID) continue;
  
  
      let x1 = currentItem.pos.x;
      let y1 = currentItem.pos.y;
      let x2 = currentItem.pos.x + currentItem.size.width;
      let y2 = currentItem.pos.y + currentItem.size.height;
  
      // (fx + dx, fy)
      if (within(fx + dx, fy, x1, y1, x2, y2) || within(fx + dx, y2, x1, y ,x2, fy)){
        if(currentItem.type !== "map"){
            xcol = currentItem;
        }
      }
        // (fx, fy + dy)
      else if (within(fx, fy + dy, x1, y1, x2, y2) || within(x2, fy + dy, x, y1, fx + w, y2)){
        if(currentItem.type !== "map"){
        ycol = currentItem;
        }
      }
  
    }
  
    return {
      x: xcol,
      y: ycol,
    }
}




