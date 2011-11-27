const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function Element(factory,x,y){
	this.x=x;
	this.y=y;
	this.factory = factory;
	this.xForCollisionCheck=x;
	this.yForCollisionCheck=y;
	this.width = 0;
	this.height = 0;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.xLastDelta = 0;
	this.yLastDelta = 0;
	this.xMaxSpeed = 99999;
	this.yMaxSpeed = 99999;
	
	this.is = function(factoryName){
		return this.factory.factoryName == factoryName;
	}
	
	this.getX = function(){
		return this.x;
	}
	
	this.getY = function(){
		return this.y;
	}
	
	this.getWidth = function(){
		return this.width;
	}
	
	this.getHeight = function(){
		return this.height;
	}
	
	this.getXSpeed= function(){
		return this.xSpeed; 
	}
	
	this.getYSpeed= function(){
		return this.ySpeed; 
	}
	
	this.setSprite = function(imageResourceName){
		this.sprite = resources.get(imageResourceName);
		this.width = this.sprite.height;
		this.height = this.sprite.width;
	}
	
	this.getXForCollisionCheck = function(){
		return this.xForCollisionCheck;
	}
	
	this.getYForCollisionCheck = function(){
		return this.yForCollisionCheck;
	}
	
	this.limitXSpeed = function(){
		if(this.xSpeed<-this.xMaxSpeed)
			this.xSpeed=-this.xMaxSpeed;
		if(this.xSpeed>this.xMaxSpeed)
			this.xSpeed=this.xMaxSpeed;
	}
	
	this.limitYSpeed = function(){
		if(this.ySpeed<-this.yMaxSpeed)
			this.ySpeed=-this.yMaxSpeed;
		if(this.ySpeed>this.yMaxSpeed)
			this.ySpeed=this.yMaxSpeed;
	}
	
	this.xAccelerate = function(xAcc){
		this.xSpeed += xAcc;
		this.limitXSpeed();
	}
	
	this.yAccelerate = function(yAcc){
		this.ySpeed += yAcc;
		this.limitYSpeed();
	}
	
	this.setMaxXSpeed = function(newMaxXSpeed){
		this.xMaxSpeed = newMaxXSpeed;
	}
	
	this.setMaxYSpeed = function(newMaxYSpeed){
		this.yMaxSpeed = newMaxYSpeed;
	}
	
	this.setXFriction = function(newXFriction){
		this.xFriction = newXFriction;
	}
	
	this.setYFriction = function(newYFriction){
		this.yFriction = newYFriction;
	}
	
	this.getValueForDelta = function(value,delta){
		return (delta*value)/1000;
	}
	
	this.getXSpeedForDelta = function(delta){
		return this.getValueForDelta(this.xSpeed,delta);
	}
	
	this.getYSpeedForDelta = function(delta){
		return this.getValueForDelta(this.ySpeed,delta);
	}
	
	this.step = function(delta,globalGameState,game){
		self = this;
		var oldX = this.x;
		var oldY = this.y;
		
		this.factory.onStep(delta,globalGameState);
		
		this.x += this.getXSpeedForDelta(delta);
		this.y += this.getYSpeedForDelta(delta);
		
		this.factory.onAfterStep(delta,globalGameState);
		
		this.xLastDelta = this.x - oldX;
		this.yLastDelta = this.y - oldY;
		
		this.xForCollisionCheck = this.x;
		this.yForCollisionCheck = this.y;
	}
}
