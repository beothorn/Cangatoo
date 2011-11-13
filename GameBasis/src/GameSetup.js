//Globals
var game;
var level;
var util = new GameUtils();
var canvas;
//--end globals

var intervalID;

var down  = 	40;
var right = 	39;
var up    = 	38;
var left  = 	37;

var globalGameState = {
	left:false,
	right:false,
	up:false,
	down:false,
	click:null
}

function startGame(drawCanvas){
	
	canvas = drawCanvas;
	document.onkeydown = function(event){keyDown(event.keyCode);}
	document.onkeyup = function(event){keyUp(event.keyCode);} 	
  canvas.onclick  = function(event){
  	
  	var x = event.layerX - canvas.offsetLeft;
  	var y = event.layerY - canvas.offsetTop;
  	canvasClick({x:x,y:y});
  };
	
	game = new Game();
	var gameCode = new BouncingBalls();
	gameCode.setup(game);
	game.reset();
	startGameLoop();
}


function canvasClick(position){
	globalGameState.click = position;
}

function keyDown(key){
	if(key == left)
		globalGameState.left = true;
	if(key == right)
		globalGameState.right = true;
	if(key == up)
		globalGameState.up = true;
	if(key == down)
		globalGameState.down = true;
}

function keyUp(key){
	if(key == left)
		globalGameState.left = false;
	if(key == right)
		globalGameState.right = false;
	if(key == up)
		globalGameState.up = false;
	if(key == down)
		globalGameState.down = false;
}



function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	intervalID = setInterval(loop, oneSecond / FPS);
}

function loop(){
	game.gameLoop(globalGameState);
}
