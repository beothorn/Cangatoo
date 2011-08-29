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
	
	var square = new Square();
	this.elements.push(square);
	
	this.isThereAnObjectOnPoint = function(x,y){
		return true;
	}
	
	this.gameLoop = function(keyboardState){
  		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		for (var i in this.elements)
		{
			this.elements[i].step(delta,keyboardState, this);
		}
		for (var i in this.elements)
		{
			this.elements[i].draw(this.context);
		}
		this.lastLoopTime = new Date().getTime();
	}
}

function Square(){
	
	this.leftLimit = 52;
	this.topLimit = 32;
	this.rightLimit = 536;
	this.bottomLimit = 596;
	
	this.x=50;
	this.y=50;
	this.width = 100;
	this.height = 100;
	
	this.xAcceleration = 50;//PixelPerSecond
	this.yAcceleration = 50;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.xMaxSpeed = 100;
	this.yMaxSpeed = 500;
	
	this.gravity = 100;
	this.xFriction = 100;
	this.yFriction = 0;
	
	
	this.wrapOnBoundaries = function(){
		if(this.x+this.width>this.rightLimit){
			this.xSpeed = 0;
			this.x = this.rightLimit - this.width;
		}
		if(this.x<this.leftLimit){
			this.xSpeed = 0;
			this.x = this.leftLimit;
		}
		if(this.y+this.height>this.bottomLimit){
			this.ySpeed = 0;
			this.y = this.bottomLimit - this.height;
		}
		if(this.y<this.topLimit){
			this.ySpeed = 0;
			this.y = this.topLimit;
		}
	}
	
	this.applyFriction = function(delta){
		if(this.xSpeed>0){
			this.xSpeed-=(delta*this.xFriction)/1000;
			if(this.xSpeed<0)
				this.xSpeed=0;
		}
		if(this.xSpeed<0){
			this.xSpeed+=(delta*this.xFriction)/1000;
			if(this.xSpeed>0)
				this.xSpeed=0;
		}
		if(this.ySpeed>0){
			this.ySpeed-=(delta*this.yFriction)/1000;
			if(this.ySpeed<0)
				this.ySpeed=0;
		}
		if(this.ySpeed<0){
			this.ySpeed+=(delta*this.yFriction)/1000;
			if(this.ySpeed>0)
				this.ySpeed=0;
		}
	}
	
	this.limitSpeed = function(){
		if(this.xSpeed<-this.xMaxSpeed)
			this.xSpeed=-this.xMaxSpeed;
		if(this.xSpeed>this.xMaxSpeed)
			this.xSpeed=this.xMaxSpeed;
		if(this.ySpeed<-this.yMaxSpeed)
			this.ySpeed=-this.yMaxSpeed;
		if(this.ySpeed>this.yMaxSpeed)
			this.ySpeed=this.yMaxSpeed;
	}
	
	this.step = function(delta, gameCommandState, game){
		if(gameCommandState.left){
			this.xSpeed-=this.xAcceleration;
		}
		if(gameCommandState.right){
			this.xSpeed+=this.xAcceleration;
		}
		if(gameCommandState.up){
			var xFoot = this.x+(this.width/2);
			var yFoot = this.y + this.height+2;
			if(game.isThereAnObjectOnPoint(xFoot,yFoot))
				this.ySpeed-=this.yAcceleration;
		}
		if(gameCommandState.down){
			this.ySpeed+=this.yAcceleration;
		}
		
		this.limitSpeed();
		this.ySpeed+=(delta*this.gravity)/1000;
		this.x+=(delta*this.xSpeed)/1000;
		this.y+=(delta*this.ySpeed)/1000;
		
		this.applyFriction(delta);
		this.wrapOnBoundaries();
	};
	
	this.draw = function(context){
		context.strokeRect(this.x, this.y, this.width, this.height);
		context.strokeRect(this.leftLimit, this.topLimit, this.rightLimit-this.leftLimit, this.bottomLimit-this.topLimit);
	};
}

var game;

function init()
{
	var FPS = 30;
	game = new Game();
	setInterval(loop, 1000 / FPS);
}

function loop(){
	game.gameLoop(keyboardState);
}
