	function MainCharacter(){
	
	this.onStep = function(element,delta,globalGameState,game){
		var xAcceleration = 100;//PixelPerSecond
		var yAcceleration = 450;
		
		var firstPoint = game.isThereAnObjectOnPoint(element.x+1,element.y+element.height+1);
		var secondPoint = game.isThereAnObjectOnPoint(element.x-1+element.width,element.y+element.height+1);
		var onGround = element.y+element.height == this.bottomLimit;
		var canJump = firstPoint || secondPoint || onGround;
		
		var gravity = 800;		
		if(!canJump)
			applyGravity(element,gravity,delta);
		
		if(globalGameState.left){
			if(element.xSpeed>0)
				element.xSpeed = 0;
			element.xAccelerate(-xAcceleration);
		}
		if(globalGameState.right){
			if(element.xSpeed<0)
				element.xSpeed = 0;
			element.xAccelerate(xAcceleration);
		}
		if(!globalGameState.left && !globalGameState.right && canJump){
			element.xSpeed = 0;
		}
		if(globalGameState.up){
			if(canJump)
				element.yAccelerate(-yAcceleration);
		}
	}

	this.leftLimit = 0;
	this.topLimit = 0;
	this.rightLimit = 1000;
	this.bottomLimit = 300;

	this.onAfterStep = function(element,delta,globalGameState,game){
		wrapOnBoundaries(element,this.topLimit,this.bottomLimit,this.rightLimit,this.leftLimit)
	}

	this.element = new Element(this,50,50);
	
	this.element.width = 50;
	this.element.height = 80;
	
	this.element.setMaxXSpeed(500);
	this.element.setMaxYSpeed(1000);
	
	this.element.setXFriction(500);

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
	
	this.getXForCollisionCheck = function(){
		return this.element.getXForCollisionCheck();
	}
	
	this.getYForCollisionCheck = function(){
		return this.element.getYForCollisionCheck();
	}
	
	this.getBottomX = function(){
		return this.element.x+(this.element.width/2);
	}
	
	this.getBottomY = function(){
		return this.element.y + this.element.height;
	}

	this.testCollisionWith = function(otherElement,delta){
		this.element.resolveCollisionWith(otherElement,delta);
	}
	
	this.step = function(delta, globalGameState, game){
		this.element.step(delta,globalGameState,game);
	};
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
		context.strokeRect(this.leftLimit, this.topLimit, this.rightLimit-this.leftLimit, this.bottomLimit-this.topLimit);
		
		
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
