//Globals
var game;
var level;
var canvas;
var self;
var resources = new Resources();
var loader = new GameLoader();
var mouse = {x:0,y:0};
var gamePaused = false;
var gameCode;
//--end globals

var intervalID;

var globalGameState = {
	left:false,
	right:false,
	up:false,
	down:false,
	click:null
};

function setGameToLoad(newGameCode){
	gameCode = newGameCode;
}

function restartGame(){
	game.clear();
	gameCode.setup();
	game.reset();
	startGameLoop();
}

function doBeforeStart(drawCanvas){
	canvas = drawCanvas;
	document.onkeydown = function(event){keyDown(event.keyCode);};
	document.onkeyup = function(event){keyUp(event.keyCode);};
	canvas.onmousedown  = function(event){
	  	var x = event.layerX - canvas.offsetLeft;
	  	var y = event.layerY - canvas.offsetTop;
	  	canvasClick({x:x,y:y});
	};
	canvas.oncontextmenu = function(e){return false;};
	canvas.onmousemove = function(event){
		var x = event.layerX - canvas.offsetLeft;
		var y = event.layerY - canvas.offsetTop;
		mouse.x = x;
		mouse.y = y;
	};
  
	game = new Game();
	gameCode.setup();
}

function startGame(drawCanvas){
	doBeforeStart(drawCanvas);
	loader.load();
}

function startGameAfterLoading(){
	restartGame();
}

function canvasClick(position){
	globalGameState.click = position;
}

function keyDown(key){
	if(key == KeyEvent.DOM_VK_LEFT)
		globalGameState.left = true;
	if(key == KeyEvent.DOM_VK_RIGHT)
		globalGameState.right = true;
	if(key == KeyEvent.DOM_VK_UP)
		globalGameState.up = true;
	if(key == KeyEvent.DOM_VK_DOWN)
		globalGameState.down = true;
}

function keyUp(key){
	if(key == KeyEvent.DOM_VK_LEFT)
		globalGameState.left = false;
	if(key == KeyEvent.DOM_VK_RIGHT)
		globalGameState.right = false;
	if(key == KeyEvent.DOM_VK_UP)
		globalGameState.up = false;
	if(key == KeyEvent.DOM_VK_DOWN)
		globalGameState.down = false;
}

function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	gamePaused = false;
	if(intervalID!=null)
		clearInterval(intervalID);
	intervalID = setInterval(loop, oneSecond / FPS);
}

function loop(){
	game.gameLoop(globalGameState);
}
