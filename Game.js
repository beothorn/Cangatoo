const FPS = 30;
const leftArrow  = 	37;
const upArrow    = 	38;
const rightArrow = 	39;
const downArrow  = 	40;

var canvas = null;
var context2D = null;
var square = null;
var lastLoopTime = new Date().getTime();

window.onload = init;

var elements = new Array();

function KeyboardState(){
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
}

var keyboardState = new KeyboardState();

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
	this.yAcceleration = 200;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.xMaxSpeed = 100;
	this.yMaxSpeed = 500;
	
	this.gravity = 100;
	this.xFriction = 100;
	this.yFriction = 100;
	
	
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
		}
		if(this.xSpeed>this.xMaxSpeed)
			this.xSpeed=this.xMaxSpeed;
		}
		if(this.ySpeed<-this.yMaxSpeed)
			this.ySpeed=-this.yMaxSpeed;
		}
		if(this.ySpeed>this.yMaxSpeed)
			this.ySpeed=this.yMaxSpeed;
		}
	}
	
	this.step = function(delta, gameCommandState){
		if(gameCommandState.left){
			this.xSpeed-=this.xAcceleration;
		}
		if(gameCommandState.right){
			this.xSpeed+=this.xAcceleration;
		}
		if(gameCommandState.up){
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

function init()
{
	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');
	setInterval(gameLoop, 1000 / FPS);
	square = new Square();
	elements.push(square);
	document.onkeydown = function(event){
		console.log(event.keyCode);
		if(event.keyCode == leftArrow)
			keyboardState.left = true;
		if(event.keyCode == rightArrow)
			keyboardState.right = true;
		if(event.keyCode == upArrow)
			keyboardState.up = true;
		if(event.keyCode == downArrow)
			keyboardState.down = true;
	}
	
  document.onkeyup = function(event){
  	console.log("!"+event.keyCode);
  	if(event.keyCode == leftArrow)
			keyboardState.left = false;
		if(event.keyCode == rightArrow)
			keyboardState.right = false;
		if(event.keyCode == upArrow)
			keyboardState.up = false;
		if(event.keyCode == downArrow)
			keyboardState.down = false;
  }
}

function gameLoop()
{
	var currentTime = new Date().getTime();
	var delta = currentTime - lastLoopTime;
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	for (var i in elements)
	{
		elements[i].step(delta,keyboardState);
	}
	for (var i in elements)
	{
		elements[i].draw(context2D);
	}
	lastLoopTime = new Date().getTime();
}
