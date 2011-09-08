window.onload = init;

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

var keyboardState = new KeyboardState();

document.onkeydown = function(event){
	if(event.keyCode == left)
		keyboardState.left = true;
	if(event.keyCode == right)
		keyboardState.right = true;
	if(event.keyCode == up)
		keyboardState.up = true;
	if(event.keyCode == down)
		keyboardState.down = true;
}
	
document.onkeyup = function(event){
  	if(event.keyCode == left)
		keyboardState.left = false;
	if(event.keyCode == right)
		keyboardState.right = false;
	if(event.keyCode == up)
		keyboardState.up = false;
	if(event.keyCode == down)
		keyboardState.down = false;
}

function Game(){
	this.lastLoopTime = new Date().getTime();
	this.elements = new Array();

	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	
	this.addElement = function(element){
		this.elements.push(element);
	}
	
	this.isObjectOnPoint = function(x,y,element){
		var elX = element.getX();
		if(x<elX)
			return false;
		var elX2 = element.getX()+element.getWidth();
		if(x>elX2)
			return false;
		var elY = element.getY();
		if(y<elY)
			return false;
		var elY2 = element.getY()+element.getHeight();
		if(y>elY2)
			return false;
		return true;
	}
	
	this.isThereAnObjectOnPoint = function(x,y){
		for (var i in this.elements)
		{
			if(this.isObjectOnPoint(x,y,this.elements[i])){
				return true;
			}
		}
		return false;
	}

	this.testCollisions = function(){
		for(var i=0;i<(this.elements.length-1);i++){
			 var element1 =this.elements[i];
			 for(var j=i+1;(j<this.elements.length);j++){
			 	 var element2 =this.elements[j];
				 element1.testCollisionWith(element2);
			 }
		 }		
	}
	
	this.gameLoop = function(keyboardState){
  	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		for (var i in this.elements)
		{
			this.elements[i].step(delta,keyboardState, this);
		}
		this.testCollisions();
		for (var i in this.elements)
		{
			this.elements[i].draw(this.context);
		}
		this.lastLoopTime = new Date().getTime();
	}
}

var game;

function init()
{
	var FPS = 30;
	game = new Game();
	var mainCharacter = new MainCharacter();
	game.addElement(mainCharacter);
	var box = new Box();
	game.addElement(box);
	
	setInterval(loop, 1000 / FPS);
}

function loop(){
	game.gameLoop(keyboardState);
}
