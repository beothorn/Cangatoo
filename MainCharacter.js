function MainCharacter(){
	
	this.element = new Element(50,50);
	
	this.element.leftLimit = 0;
	this.element.topLimit = 0;
	this.element.rightLimit = 1000;
	this.element.bottomLimit = 300;
	
	this.element.width = 50;
	this.element.height = 80;
	
	this.element.setMaxXSpeed(500);
	this.element.setMaxYSpeed(1000);
	
	this.element.setXFriction(500);
	
	this.xAcceleration = 100;//PixelPerSecond
	this.yAcceleration = 450;

	this.getX = function(){
		return this.element.x;
	}
	this.getY = function(){
		return this.element.y;
	}
	this.getWidth = function(){
		return this.element.width;
	}
	
	this.getHeight = function(){
		return this.element.height;
	}
	
	this.getBottomX = function(){
		return this.element.x+(this.element.width/2);
	}
	
	this.getBottomY = function(){
		return this.element.y + this.element.height;
	}
	
	this.canJump = function(game){
		var firstPoint = game.isThereAnObjectOnPoint(this.element.x+1,this.element.y+this.element.height+1);
		var secondPoint = game.isThereAnObjectOnPoint(this.element.x-1+this.element.width,this.element.y+this.element.height+1);
		var onGround = this.element.y+this.element.height == this.element.bottomLimit;
		return firstPoint || secondPoint || onGround;
	}

	this.testCollisionWith = function(otherElement,delta){
		this.element.resolveCollisionWith(otherElement,delta);
	}
	
	this.step = function(delta, globalGameState, game){
		if(this.canJump(game))
			this.element.gravity = 0;
		else
			this.element.gravity = 800;
		
		if(globalGameState.left){
			if(this.element.xSpeed>0)
				this.element.xSpeed = 0;
			this.element.xAccelerate(-this.xAcceleration);
		}
		if(globalGameState.right){
			if(this.element.xSpeed<0)
				this.element.xSpeed = 0;
			this.element.xAccelerate(this.xAcceleration);
		}
		if(!globalGameState.left && !globalGameState.right && this.canJump(game)){
			this.element.xSpeed = 0;
		}
		if(globalGameState.up){
			if(this.canJump(game))
				this.element.yAccelerate(-this.yAcceleration);
		}
		
		this.element.step(delta);
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
		context.strokeRect(this.element.leftLimit, this.element.topLimit, this.element.rightLimit-this.element.leftLimit, this.element.bottomLimit-this.element.topLimit);
		
		
		//DEBUG - Show movementLines
		/**
		var selfTopLeftX = Math.floor(this.element.x);
		var selfTopLeftY = Math.floor(this.element.y);
		var selfBottomLeftY = selfTopLeftY+this.element.height;
		var selfTopRightX = selfTopLeftX+this.element.width;
		
		var floorSpeedX = Math.floor(this.element.getXSpeedForDelta(delta));
		var floorSpeedY = Math.floor(this.element.getYSpeedForDelta(delta));
		
		var topLeftMovement    = {x1: selfTopLeftX  ,y1: selfTopLeftY    ,x2: selfTopLeftX-floorSpeedX   ,y2: selfTopLeftY-floorSpeedY   };
		var topRightMovement   = {x1: selfTopRightX ,y1: selfTopLeftY    ,x2: selfTopRightX-floorSpeedX  ,y2: selfTopLeftY-floorSpeedY   };
		var bottomLeftMovement = {x1: selfTopLeftX  ,y1: selfBottomLeftY ,x2: selfTopLeftX-floorSpeedX   ,y2: selfBottomLeftY-floorSpeedY};
		var bottomRightMovement= {x1: selfTopRightX ,y1: selfBottomLeftY ,x2: selfTopRightX-floorSpeedX  ,y2: selfBottomLeftY-floorSpeedY};
		
		context.strokeStyle = "red";
		context.beginPath();
    context.moveTo(topLeftMovement.x1,topLeftMovement.y1);
    context.lineTo(topLeftMovement.x2,topLeftMovement.y2);
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.moveTo(topRightMovement.x1,topRightMovement.y1);
    context.lineTo(topRightMovement.x2,topRightMovement.y2);
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.moveTo(bottomLeftMovement.x1,bottomLeftMovement.y1);
    context.lineTo(bottomLeftMovement.x2,bottomLeftMovement.y2);
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.moveTo(bottomRightMovement.x1,bottomRightMovement.y1);
    context.lineTo(bottomRightMovement.x2,bottomRightMovement.y2);
    context.stroke();
    context.closePath();
    **/
	};
}
