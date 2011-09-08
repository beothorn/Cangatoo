function Element(_x,_y){
	this.x=_x;
	this.y=_y;
	this.width = 0;
	this.height = 0;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.xMaxSpeed = 99999;
	this.yMaxSpeed = 99999;
	this.xFriction = 0;
	this.yFriction = 0;
	this.gravity = 0;
	
	this.leftLimit = -99999;
	this.topLimit = -99999;
	this.rightLimit = 99999;
	this.bottomLimit = 99999;
	
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
		if(newXFriction<0)
			throw "X friction must be positive "+newXFriction;
		this.xFriction = newXFriction;
	}
	
	this.setYFriction = function(newYFriction){
		if(newYFriction<0)
			throw "Y friction must be positive "+newYFriction;
		this.yFriction = newYFriction;
	}
	
	this.moveToIntersectionPointAndBounce = function(intersection,movementLine,bounceHorizontally){
		var insideX = movementLine.x1 - intersection.x;
		var insideY = movementLine.y1 - intersection.y; 
		this.x -= insideX;
		this.y -= insideY;
		
		if(bounceHorizontally){
			this.x -= insideX;
			this.y += insideY;
			this.xSpeed = this.xSpeed * -1;
		}else{
			this.x += insideX;
			this.y -= insideY;
			this.ySpeed = this.ySpeed * -1;
		}
	}
	
	this.resolveCollisionWith = function(otherElement){		
		var topLeftX = otherElement.x;
		var topLeftY = otherElement.y;
		var bottomLeftY = otherElement.y+otherElement.height;
		var topRightX = otherElement.x+otherElement.width;
		
		var otherElementLeftSide  = {x1: topLeftX  ,y1: topLeftY    ,x2: topLeftX   ,y2: bottomLeftY};
		var otherElementRightSide = {x1: topRightX ,y1: topLeftY    ,x2: topRightX  ,y2: bottomLeftY};
		var otherElementUpSide    = {x1: topLeftX  ,y1: topLeftY    ,x2: topRightX  ,y2: topLeftY   };
		var otherElementDownSide  = {x1: topLeftX  ,y1: bottomLeftY ,x2: topRightX  ,y2: bottomLeftY};
		
		var selfTopLeftX = this.x;
		var selftopLeftY = this.y;
		var selfBottomLeftY = this.y+this.height;
		var selfTopRightX = this.x+this.width;
		
		var topLeftMovement    = {x1: selfTopLeftX  ,y1: selftopLeftY    ,x2: selfTopLeftX-this.xSpeed   ,y2: selftopLeftY-this.ySpeed   };
		var topRightMovement   = {x1: selfTopRightX ,y1: selftopLeftY    ,x2: selfTopRightX-this.xSpeed  ,y2: selftopLeftY-this.ySpeed   };
		var bottomLeftMovement = {x1: selfTopLeftX  ,y1: selfBottomLeftY ,x2: selfTopLeftX-this.xSpeed   ,y2: selfBottomLeftY-this.ySpeed};
		var bottomRightMovement= {x1: selfTopRightX ,y1: selfBottomLeftY ,x2: selfTopRightX-this.xSpeed  ,y2: selfBottomLeftY-this.ySpeed};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		var i;
		for(i=0;i<4;i++){
			var intersection;
			intersection = lineIntersect(movementLines[i],otherElementUpSide);
			if(intersection != null){
				this.moveToIntersectionPointAndBounce(intersection,movementLines[i],false);
				return;
			}
			
			intersection = lineIntersect(movementLines[i],otherElementDownSide);
			if(intersection != null){
				this.moveToIntersectionPointAndBounce(intersection,movementLines[i],false);
				return;
			}
			
			intersection = lineIntersect(movementLines[i],otherElementLeftSide);
			if(intersection != null){
				this.moveToIntersectionPointAndBounce(intersection,movementLines[i],true);
				return;
			}
			
			intersection = lineIntersect(movementLines[i],otherElementRightSide);
			if(intersection != null){
				this.moveToIntersectionPointAndBounce(intersection,movementLines[i],true);
				return;
			}
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
	
	this.step = function(delta){
		this.x += (delta*this.xSpeed)/1000;
		this.y += (delta*this.ySpeed)/1000;
		
		this.ySpeed+=(delta*this.gravity)/1000;
		
		this.applyFriction(delta);
		this.wrapOnBoundaries();
	}
}

function MainCharacter(){
	
	this.element = new Element(50,50);
	
	this.element.leftLimit = 52;
	this.element.topLimit = 32;
	this.element.rightLimit = 536;
	this.element.bottomLimit = 596;
	
	this.element.width = 50;
	this.element.height = 80;
	this.element.gravity = 800;
	
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
		var firstPoint = game.isThereAnObjectOnPoint(this.element.x,this.element.y+this.element.height+1);
		var secondPoint = game.isThereAnObjectOnPoint(this.element.x+this.element.width,this.element.y+this.element.height+1);
		var onGround = this.element.y+this.element.height == this.element.bottomLimit;
		return firstPoint || secondPoint || onGround;
	}

	this.testCollisionWith = function(otherElement){
		this.element.resolveCollisionWith(otherElement);
	}
	
	this.step = function(delta, gameCommandState, game){
		if(gameCommandState.left){
			if(this.element.xSpeed>0)
				this.element.xSpeed = 0;
			this.element.xAccelerate(-this.xAcceleration);
		}
		if(gameCommandState.right){
			if(this.element.xSpeed<0)
				this.element.xSpeed = 0;
			this.element.xAccelerate(this.xAcceleration);
		}
		if(!gameCommandState.left && !gameCommandState.right && this.canJump(game)){
			this.element.xSpeed = 0;
		}
		if(gameCommandState.up){
			if(this.canJump(game))
				this.element.yAccelerate(-this.yAcceleration);
		}
		
		this.element.step(delta);
	};
	
	this.draw = function(context){
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
		context.strokeRect(this.element.leftLimit, this.element.topLimit, this.element.rightLimit-this.element.leftLimit, this.element.bottomLimit-this.element.topLimit);
	};
}
