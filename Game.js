window.onload = init;

function Output(){
	this.write = function(text){
		if(this.textArea==null)
			this.textArea = document.getElementById('output');
		this.textArea.innerHTML += text+"\n";  
	}
}

var down  = 	40;
var right = 	39;
var up    = 	38;
var left  = 	37;

function KeyboardState(){
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
}

var globalGameState = new KeyboardState();

document.onkeydown = function(event){
	if(event.keyCode == left)
		globalGameState.left = true;
	if(event.keyCode == right)
		globalGameState.right = true;
	if(event.keyCode == up)
		globalGameState.up = true;
	if(event.keyCode == down)
		globalGameState.down = true;
}
	
document.onkeyup = function(event){
  if(event.keyCode == left)
		globalGameState.left = false;
	if(event.keyCode == right)
		globalGameState.right = false;
	if(event.keyCode == up)
		globalGameState.up = false;
	if(event.keyCode == down)
		globalGameState.down = false;
}

var output = new Output();
var game;
var intervalID;

function init(){
	game = new Game(document.getElementById('canvas'));
	var mainCharacter = new MainCharacter();
	game.addElement(mainCharacter);
	game.addElement(new Box(140,220,32,32));
	game.addElement(new Box(300,200,32,32));
	game.addElement(new Box(200,100,32,32));
	startGameLoop();
}


function startGameLoop(){
	var FPS = 30;
	var oneSecond = 1000;
	intervalID = setInterval(loop, oneSecond / FPS);
	output.write("intervalID: "+intervalID);
}

function loop(){
	game.gameLoop(globalGameState);
}
