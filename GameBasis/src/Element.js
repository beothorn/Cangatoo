const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function Element(_factory,_x,_y){
	this.x=_x;
	this.y=_y;
	this.factory = _factory;
	this.xForCollisionCheck=_x;
	this.yForCollisionCheck=_y;
	this.width = 0;
	this.height = 0;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	this.xLastDelta = 0;
	this.yLastDelta = 0;
	this.xMaxSpeed = 99999;
	this.yMaxSpeed = 99999;
	this.xFriction = 0;
	this.yFriction = 0;
	this.elasticity = 0;//1;
	
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

	this.moveToIntersectionPointAndBounce = function(insideX,insideY,side){
		
		var bounceHorizontally = side == LEFT || side == RIGHT;
		
		this.x -= insideX;
		this.y -= insideY;
		
		if(bounceHorizontally){
			if(insideX>0)
				this.x-=1;
			if(insideX<0)
				this.x+=1;
			
			this.x -= insideX * this.elasticity;
			this.y += insideY;
			this.xSpeed = this.xSpeed * -1 * this.elasticity;
		}else{
			if(insideY>0)
				this.y-=1;
			if(insideY<0)
				this.y+=1;
			
			this.x += insideX;
			this.y -= insideY * this.elasticity;
			this.ySpeed = this.ySpeed * -1 * this.elasticity;
		}
	}
	
	this.getMovementLinesIntersectingSidesInsideParts = function(movementLines,upSide,downSide,leftSide,rightSide,speedX,speedY){
		var insideRectangleMovement = new Array();
		var i; 
		for(i=0;i<4;i++){
			var distanceUp = 0;
			var distanceDown = 0;
			var distanceRight = 0;
			var distanceLeft = 0;
			
			var intersectionUp;
			var intersectionDown;
			var intersectionLeft;
			var intersectionRight;
			
			if(speedX>=0){
				intersectionLeft = lineIntersect(movementLines[i],leftSide);
				if(intersectionLeft != null){
					var insideX = movementLines[i].x1 - intersectionLeft.x;
					var insideY = movementLines[i].y1 - intersectionLeft.y;
					insideRectangleMovement.push({x:insideX,y:insideY,side:RIGHT});//movement lines on left side of other means right side 
				}
			}
			
			if(speedX<=0){
				intersectionRight = lineIntersect(movementLines[i],rightSide);
				if(intersectionRight != null){
					var insideX = movementLines[i].x1 - intersectionRight.x;
					var insideY = movementLines[i].y1 - intersectionRight.y;
					insideRectangleMovement.push({x:insideX,y:insideY,side:LEFT});//movement lines on right side of other means left side
				}
			}
			
			if(speedY>=0){
				intersectionUp = lineIntersect(movementLines[i],upSide);
				if(intersectionUp != null){
					var insideX = movementLines[i].x1 - intersectionUp.x;
					var insideY = movementLines[i].y1 - intersectionUp.y;
					insideRectangleMovement.push({x:insideX,y:insideY,side:DOWN});//movement lines on up side of other means down side
				}
			}
			
			if(speedY<=0){
				intersectionDown = lineIntersect(movementLines[i],downSide);
				if(intersectionDown != null){
					var insideX = movementLines[i].x1 - intersectionDown.x;
					var insideY = movementLines[i].y1 - intersectionDown.y;
					insideRectangleMovement.push({x:insideX,y:insideY,side:UP});//movement lines on down side of other means up side
				}
			}
		}
		return insideRectangleMovement;
	}
	
	this.getMoveThatResolvesCollision = function(element,movementLines,upSide,downSide,leftSide,rightSide,speedX,speedY){
		
		var insideRectangleMovement = this.getMovementLinesIntersectingSidesInsideParts(movementLines,upSide,downSide,leftSide,rightSide,speedX,speedY);
		
		var otherRect = {x1:upSide.x1,y1:upSide.y1,x2:downSide.x2,y2:downSide.y2};
		for(i=0;i<insideRectangleMovement.length;i++){
			var insideRectangleMovementToCompare = insideRectangleMovement[i];
			var newX1 = element.getXForCollisionCheck() - insideRectangleMovementToCompare.x;
			var newY1 = element.getYForCollisionCheck() - insideRectangleMovementToCompare.y;
			
			if(insideRectangleMovementToCompare.side == RIGHT || insideRectangleMovementToCompare.side == LEFT){
				if(insideRectangleMovementToCompare.x>0)
					newX1-=1;
				if(insideRectangleMovementToCompare.x<0)
					newX1+=1;
			}else{
				if(insideRectangleMovementToCompare.y>0)
					newY1-=1;
				if(insideRectangleMovementToCompare.y<0)
					newY1+=1;
			}
			
			var newX2 = newX1 + element.getWidth();
			var newY2 = newY1 + element.getHeight();
			
			var newRect = {x1:newX1,y1:newY1,x2:newX2,y2:newY2};
			
			if(!rectanglesIntersect(newRect,otherRect)){
				return insideRectangleMovementToCompare;
			}
		}
		
		return null;
	}
	
	this.testSelfMovementLinesOnOther = function(otherElement){
		var topLeftX = otherElement.getXForCollisionCheck();
		var topLeftY = otherElement.getYForCollisionCheck();
		var bottomLeftY = topLeftY+otherElement.getHeight();
		var topRightX = topLeftX+otherElement.getWidth();
		
		var otherElementLeftSide  = {x1: topLeftX  ,y1: topLeftY    ,x2: topLeftX   ,y2: bottomLeftY};
		var otherElementRightSide = {x1: topRightX ,y1: topLeftY    ,x2: topRightX  ,y2: bottomLeftY};
		var otherElementUpSide    = {x1: topLeftX  ,y1: topLeftY    ,x2: topRightX  ,y2: topLeftY   };
		var otherElementDownSide  = {x1: topLeftX  ,y1: bottomLeftY ,x2: topRightX  ,y2: bottomLeftY};
		
		var selfTopLeftX = this.getXForCollisionCheck();
		var selfTopLeftY = this.getYForCollisionCheck();
		var selfBottomLeftY = selfTopLeftY+this.height;
		var selfTopRightX = selfTopLeftX+this.width;
		
		var roundSpeedX = this.xLastDelta;
		var roundSpeedY = this.yLastDelta;
		
		var topLeftMovement    = {x1: selfTopLeftX  ,y1: selfTopLeftY    ,x2: selfTopLeftX-roundSpeedX   ,y2: selfTopLeftY-roundSpeedY   };
		var topRightMovement   = {x1: selfTopRightX ,y1: selfTopLeftY    ,x2: selfTopRightX-roundSpeedX  ,y2: selfTopLeftY-roundSpeedY   };
		var bottomLeftMovement = {x1: selfTopLeftX  ,y1: selfBottomLeftY ,x2: selfTopLeftX-roundSpeedX   ,y2: selfBottomLeftY-roundSpeedY};
		var bottomRightMovement= {x1: selfTopRightX ,y1: selfBottomLeftY ,x2: selfTopRightX-roundSpeedX  ,y2: selfBottomLeftY-roundSpeedY};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		
		var moveThatResolvesCollision = this.getMoveThatResolvesCollision(this,movementLines,otherElementUpSide,otherElementDownSide,otherElementLeftSide,otherElementRightSide,this.xSpeed,this.ySpeed);
		return moveThatResolvesCollision;
	}
	
	this.testOtherMovementLinesOnSelf = function(otherElement){
		var topLeftX = this.getXForCollisionCheck();
		var topLeftY = this.getYForCollisionCheck();
		var bottomLeftY = topLeftY+this.height;
		var topRightX = topLeftX+this.width;
		
		var elementLeftSide  = {x1: topLeftX  ,y1: topLeftY    ,x2: topLeftX   ,y2: bottomLeftY};
		var elementRightSide = {x1: topRightX ,y1: topLeftY    ,x2: topRightX  ,y2: bottomLeftY};
		var elementUpSide    = {x1: topLeftX  ,y1: topLeftY    ,x2: topRightX  ,y2: topLeftY   };
		var elementDownSide  = {x1: topLeftX  ,y1: bottomLeftY ,x2: topRightX  ,y2: bottomLeftY};
		
		var otherTopLeftX = otherElement.getXForCollisionCheck();
		var otherTopLeftY = otherElement.getYForCollisionCheck();
		var otherBottomLeftY = otherTopLeftY+otherElement.getHeight();
		var otherTopRightX = otherTopLeftX+otherElement.getWidth();
		
		var roundSpeedX = this.xLastDelta *-1;
		var roundSpeedY = this.yLastDelta *-1;
		
		var topLeftMovement    = {x1: otherTopLeftX  ,y1: otherTopLeftY    ,x2: otherTopLeftX-roundSpeedX   ,y2: otherTopLeftY-roundSpeedY   };
		var topRightMovement   = {x1: otherTopRightX ,y1: otherTopLeftY    ,x2: otherTopRightX-roundSpeedX  ,y2: otherTopLeftY-roundSpeedY   };
		var bottomLeftMovement = {x1: otherTopLeftX  ,y1: otherBottomLeftY ,x2: otherTopLeftX-roundSpeedX   ,y2: otherBottomLeftY-roundSpeedY};
		var bottomRightMovement= {x1: otherTopRightX ,y1: otherBottomLeftY ,x2: otherTopRightX-roundSpeedX  ,y2: otherBottomLeftY-roundSpeedY};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		
		var moveThatResolvesCollision = this.getMoveThatResolvesCollision(otherElement,movementLines,elementUpSide,elementDownSide,elementLeftSide,elementRightSide,this.xSpeed*-1,this.ySpeed*-1);
		return moveThatResolvesCollision;
	}
	
	this.resolveCollisionWith = function(otherElement,delta){
		if(this == otherElement)
			return;
		
		var selfRectangle =  {x1: this.getXForCollisionCheck() ,y1: this.getYForCollisionCheck() ,x2: this.getXForCollisionCheck()+this.width ,y2: this.y+this.height};
		var otherRectangle = {x1: otherElement.getXForCollisionCheck() ,y1: otherElement.getYForCollisionCheck() ,x2: otherElement.getXForCollisionCheck()+otherElement.getWidth() ,y2: otherElement.getYForCollisionCheck()+otherElement.getHeight()};
		
		if(!rectanglesIntersect(selfRectangle,otherRectangle)){
			return;
		}
		
		var moveThatResolvesCollision = this.testSelfMovementLinesOnOther(otherElement);
		if(moveThatResolvesCollision!=null){
			
			this.moveToIntersectionPointAndBounce(moveThatResolvesCollision.x,moveThatResolvesCollision.y,moveThatResolvesCollision.side);
			
			/**
			if(moveThatResolvesCollision.side == UP)
				output.write("UP");
			if(moveThatResolvesCollision.side == DOWN)
				output.write("DOWN");
			if(moveThatResolvesCollision.side == LEFT)
				output.write("LEFT");
			if(moveThatResolvesCollision.side == RIGHT)
				output.write("RIGHT");
			**/
			
			return;
		}
		moveThatResolvesCollision = this.testOtherMovementLinesOnSelf(otherElement);
		if(moveThatResolvesCollision!=null){
			
			this.moveToIntersectionPointAndBounce(moveThatResolvesCollision.x*-1,moveThatResolvesCollision.y*-1,moveThatResolvesCollision.side);
			
			/**
			if(moveThatResolvesCollision.side == UP)
				output.write("DOWN");
			if(moveThatResolvesCollision.side == DOWN)
				output.write("UP");
			if(moveThatResolvesCollision.side == LEFT)
				output.write("RIGHT");
			if(moveThatResolvesCollision.side == RIGHT)
				output.write("LEFT");
			**/
				
			return;
		}		
	}
	
	this.applyFriction = function(delta){
		if(this.xSpeed>0){
			this.xSpeed-=this.getValueForDelta(this.xFriction,delta);
			if(this.xSpeed<0)
				this.xSpeed=0;
		}
		if(this.xSpeed<0){
			this.xSpeed+=this.getValueForDelta(this.xFriction,delta);
			if(this.xSpeed>0)
				this.xSpeed=0;
		}
		if(this.ySpeed>0){
			this.ySpeed-=this.getValueForDelta(this.yFriction,delta);
			if(this.ySpeed<0)
				this.ySpeed=0;
		}
		if(this.ySpeed<0){
			this.ySpeed+=this.getValueForDelta(this.yFriction,delta);
			if(this.ySpeed>0)
				this.ySpeed=0;
		}
	}
	
	this.step = function(delta,globalGameState,game){
		var oldX = this.x;
		var oldY = this.y;
		
		if(this.factory.onStep != null)
			this.factory.onStep(this,delta,globalGameState,game);
		
		this.applyFriction(delta);//Get this out
		
		this.x += this.getXSpeedForDelta(delta);
		this.y += this.getYSpeedForDelta(delta);
		
		if(this.factory.onAfterStep != null)
			this.factory.onAfterStep(this,delta,globalGameState,game);
		
		this.xLastDelta = this.x - oldX;
		this.yLastDelta = this.y - oldY;
		
		this.xForCollisionCheck = this.x;
		this.yForCollisionCheck = this.y;
	}
}
