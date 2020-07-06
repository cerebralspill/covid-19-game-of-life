
function make2DArray(cols,rows){
    let array = new Array(cols);
    for(let i = 0; i < cols; i++){
      array[i] = new Array(rows);
      for(let j = 0; j < rows; j++){
        array[i][j] = 0;
      }
    }
    return array;
  }
  
  const cols = 20;
  const rows = 20;
  let space;
  let myGrid = make2DArray(cols,rows);
  
  let selectX = 10;
  let selectY = 10;
  let running = false;
  let xoffset;
  /* framerate */
  let fr = 2;
  function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    /* fitting the grid in the window */
    /* we want it as big as possible without going out of the viewport */
    space = min(width,height) / max(rows, cols);
    frameRate(fr);
    /* Starting with a glider */
    myGrid[10][10] = 1;
    myGrid[10][8] = 1;
    myGrid[10][9] = 1;
    myGrid[9][10] = 1;
    myGrid[8][8] = 1;
    xoffset = width/2 - space * cols * 0.5;
  }
  function draw() {
    frameRate(fr);
    background(0);
    /* centering the grid */
    translate(xoffset, 0);
    drawGrid(myGrid);
    fill(220);
    text("Press ENTER", -120, 10);
    text("To Start and Stop", -120, 30);
    text("CLICK Squares", -120, 50);
    text("To change state", -120, 70);
    text("Framerate: " + fr, -120, 90);
    text("Use UP and DOWN", -120, 110);
    text("To speed up", -120, 130);
    text("Or slow down", -120, 150);
    /* for running state */
    if(running){
      runningDraw();
    } else {
      pauseDraw();
    }
  }
  
  function drawGrid(grid){
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        if(grid[i][j]==0){
      fill(245,222,179);
        } else {
      fill(0,100,0);
        }
        stroke(160,82,45);
        rect(i*space,j*space,space,space);
      }
    }
  }
  
  function computeNext(grid,x,y){
    let sum = 0;
    /* Using modulo cols and rows - 1 leads to a wraparound world */
    sum += grid[(x-1+cols) % cols][(y-1+rows) % rows];
    sum += grid[x % cols][(y-1+rows) % rows];
    sum += grid[(x+1) % cols][(y-1+rows) % rows];
    
    sum += grid[(x-1+cols) % cols][y];
    sum += grid[(x+1) % cols][y];
  
    sum += grid[(x-1+cols) % cols][(y+1) % rows];
    sum += grid[x][(y+1) % rows];
    sum += grid[(x+1) % cols][(y+1) % rows];
  
    /* Testing the rules */
    if(grid[x][y] == 0 && sum == 3){
      return 1;
    } else if(grid[x][y] == 1 && (sum < 2 || sum > 3)){
      return 0;
    } else {
      return grid[x][y];
    }
  }
  
  function keyPressed(){
    console.log("Pressed");
    if(keyCode === ENTER){
      running = !running;
    } else if(keyCode === UP_ARROW){
      fr++;
    } else if(keyCode === DOWN_ARROW){
      fr--;
    }
  }
  
  function runningDraw(){
    text("running",-120,190);
    let next = make2DArray(cols,rows);
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        next[i][j] = computeNext(myGrid, i, j);
      }
    }
    myGrid = next;
  }
  
  function pauseDraw(){
    text("paused",-120,190);
  }
  
  function mousePressed(){
    selectX = Math.floor((mouseX-xoffset) / space);
    selectY = Math.floor(mouseY / space);
    if(myGrid[selectX][selectY] == 0){
      myGrid[selectX][selectY] = 1;
    } else {
      myGrid[selectX][selectY] = 0;
    }
    console.log(`x: ${selectX}\ny: ${selectY}`);
  }