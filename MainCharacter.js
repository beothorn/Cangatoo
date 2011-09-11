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
	this.elasticity = 0;//1;
	
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
	
	this.getValueForDelta = function(value,delta){
		return (delta*value)/1000;
	}
	
	this.getXSpeedForDelta = function(delta){
		return this.getValueForDelta(this.xSpeed,delta);
	}
	
	this.getYSpeedForDelta = function(delta){
		return this.getValueForDelta(this.ySpeed,delta);
	}
	
	this.moveToIntersectionPointAndBounce = function(insideX,insideY,bounceHorizontally){
		
		this.x -= insideX;
		this.y -= insideY;
		
		if(bounceHorizontally){
			if(insideX>0)
				this.x-=1;
			else
				this.x+=1;
			this.x -= Math.round(insideX * this.elasticity);
			this.y += insideY;
			this.xSpeed = this.xSpeed * -1 * this.elasticity;
		}else{
			if(insideY>0)
				this.y-=1;
			else
				this.y+=1;
			this.x += insideX;
			this.y -= Math.round(insideY * this.elasticity);
			this.ySpeed = this.ySpeed * -1 * this.elasticity;
		}
	}
	
	this.isBiggest = function(a,b,c,d){
		if(b>a)
			return false;
		if(c>a)
			return false;
		if(d>a)
			return false;
		return true;
	}
	
	this.allZeroes = function(a,b,c,d){
		if(a!=0)
			return false;
		if(b!=0)
			return false;
		if(c!=0)
			return false;
		if(d!=0)
			return false;
		return true;
	}
	
	this.getInsideLineFor = function(movementLines,upSide,downSide,leftSide,rightSide,speedX,speedY){
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
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:true});
				}
			}
			
			if(speedX<=0){
				intersectionRight = lineIntersect(movementLines[i],rightSide);
				if(intersectionRight != null){
					var insideX = movementLines[i].x1 - intersectionRight.x;
					var insideY = movementLines[i].y1 - intersectionRight.y;
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:true});
				}
			}
			
			if(speedY>=0){
				intersectionUp = lineIntersect(movementLines[i],upSide);
				if(intersectionUp != null){
					var insideX = movementLines[i].x1 - intersectionUp.x;
					var insideY = movementLines[i].y1 - intersectionUp.y;
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:false});
				}
			}
			
			if(speedY<=0){
				intersectionDown = lineIntersect(movementLines[i],downSide);
				if(intersectionDown != null){
					var insideX = movementLines[i].x1 - intersectionDown.x;
					var insideY = movementLines[i].y1 - intersectionDown.y;
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:false});
				}
			}
		}
		
		var biggestMove = null;
		var biggestDistance = 0;
		for(i=0;i<insideRectangleMovement.length;i++){
			var insideRectangleMovementToCompare = insideRectangleMovement[i];
			var distance = Math.abs(insideRectangleMovementToCompare.x) + Math.abs(insideRectangleMovementToCompare.y);
			if(biggestMove != null){
				if(distance>biggestDistance){
					biggestMove = insideRectangleMovementToCompare;
					biggestDistance = distance;
				}
			}else{
				biggestMove = insideRectangleMovementToCompare;
				biggestDistance = distance;
			}
		}
		return biggestMove;
	}
	
	this.testSelfMovementLinesOnOther = function(otherElement,delta){
		var topLeftX = otherElement.x;
		var topLeftY = otherElement.y;
		var bottomLeftY = topLeftY+otherElement.height;
		var topRightX = topLeftX+otherElement.width;
		
		var otherElementLeftSide  = {x1: topLeftX  ,y1: topLeftY    ,x2: topLeftX   ,y2: bottomLeftY};
		var otherElementRightSide = {x1: topRightX ,y1: topLeftY    ,x2: topRightX  ,y2: bottomLeftY};
		var otherElementUpSide    = {x1: topLeftX  ,y1: topLeftY    ,x2: topRightX  ,y2: topLeftY   };
		var otherElementDownSide  = {x1: topLeftX  ,y1: bottomLeftY ,x2: topRightX  ,y2: bottomLeftY};
		
		var selfTopLeftX = this.x;
		var selfTopLeftY = this.y;
		var selfBottomLeftY = selfTopLeftY+this.height;
		var selfTopRightX = selfTopLeftX+this.width;
		
		var roundSpeedX = Math.round(this.getXSpeedForDelta(delta));
		var roundSpeedY = Math.round(this.getYSpeedForDelta(delta));
		
		var topLeftMovement    = {x1: selfTopLeftX  ,y1: selfTopLeftY    ,x2: selfTopLeftX-roundSpeedX   ,y2: selfTopLeftY-roundSpeedY   };
		var topRightMovement   = {x1: selfTopRightX ,y1: selfTopLeftY    ,x2: selfTopRightX-roundSpeedX  ,y2: selfTopLeftY-roundSpeedY   };
		var bottomLeftMovement = {x1: selfTopLeftX  ,y1: selfBottomLeftY ,x2: selfTopLeftX-roundSpeedX   ,y2: selfBottomLeftY-roundSpeedY};
		var bottomRightMovement= {x1: selfTopRightX ,y1: selfBottomLeftY ,x2: selfTopRightX-roundSpeedX  ,y2: selfBottomLeftY-roundSpeedY};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		
		var biggestMove = this.getInsideLineFor(movementLines,otherElementUpSide,otherElementDownSide,otherElementLeftSide,otherElementRightSide,this.xSpeed,this.ySpeed);
		return biggestMove;
	}
	
	this.testOtherMovementLinesOnSelf = function(otherElement,delta){
		var topLeftX = this.x;
		var topLeftY = this.y;
		var bottomLeftY = topLeftY+this.height;
		var topRightX = topLeftX+this.width;
		
		var elementLeftSide  = {x1: topLeftX  ,y1: topLeftY    ,x2: topLeftX   ,y2: bottomLeftY};
		var elementRightSide = {x1: topRightX ,y1: topLeftY    ,x2: topRightX  ,y2: bottomLeftY};
		var elementUpSide    = {x1: topLeftX  ,y1: topLeftY    ,x2: topRightX  ,y2: topLeftY   };
		var elementDownSide  = {x1: topLeftX  ,y1: bottomLeftY ,x2: topRightX  ,y2: bottomLeftY};
		
		var otherTopLeftX = otherElement.x;
		var otherTopLeftY = otherElement.y;
		var otherBottomLeftY = otherTopLeftY+otherElement.height;
		var otherTopRightX = otherTopLeftX+otherElement.width;
		
		var roundSpeedX = Math.round(this.getXSpeedForDelta(delta)) *-1;
		var roundSpeedY = Math.round(this.getYSpeedForDelta(delta)) *-1;
		
		var topLeftMovement    = {x1: otherTopLeftX  ,y1: otherTopLeftY    ,x2: otherTopLeftX-roundSpeedX   ,y2: otherTopLeftY-roundSpeedY   };
		var topRightMovement   = {x1: otherTopRightX ,y1: otherTopLeftY    ,x2: otherTopRightX-roundSpeedX  ,y2: otherTopLeftY-roundSpeedY   };
		var bottomLeftMovement = {x1: otherTopLeftX  ,y1: otherBottomLeftY ,x2: otherTopLeftX-roundSpeedX   ,y2: otherBottomLeftY-roundSpeedY};
		var bottomRightMovement= {x1: otherTopRightX ,y1: otherBottomLeftY ,x2: otherTopRightX-roundSpeedX  ,y2: otherBottomLeftY-roundSpeedY};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		
		var biggestMove = this.getInsideLineFor(movementLines,elementUpSide,elementDownSide,elementLeftSide,elementRightSide,this.xSpeed*-1,this.ySpeed*-1);
		return biggestMove;
	}
	
	this.resolveCollisionWith = function(otherElement,delta){
		if(this == otherElement)
			return;
		
		var biggestMove = this.testSelfMovementLinesOnOther(otherElement,delta);
		if(biggestMove!=null){
			this.moveToIntersectionPointAndBounce(biggestMove.x,biggestMove.y,biggestMove.bounceHor);
			return;
		}
		biggestMove = this.testOtherMovementLinesOnSelf(otherElement,delta);
		if(biggestMove!=null){
			this.moveToIntersectionPointAndBounce(biggestMove.x*-1,biggestMove.y*-1,biggestMove.bounceHor);
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
		this.applyFriction(delta);
		
		this.x += Math.round(this.getXSpeedForDelta(delta));
		this.y += Math.round(this.getYSpeedForDelta(delta));
		
		this.ySpeed+=Math.round(this.getValueForDelta(this.gravity,delta));
		
		this.wrapOnBoundaries();
	}
}

function MainCharacter(){
	
	this.element = new Element(50,50);
	
	this.element.leftLimit = 0;
	this.element.topLimit = 0;
	this.element.rightLimit = 400;
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
	
	this.step = function(delta, gameCommandState, game){
		if(this.canJump(game))
			this.element.gravity = 0;
		else
			this.element.gravity = 800;
		
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
	
	this.draw = function(context,delta){
		context.strokeStyle = "gray";
		context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
		context.strokeRect(this.element.leftLimit, this.element.topLimit, this.element.rightLimit-this.element.leftLimit, this.element.bottomLimit-this.element.topLimit);
		
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
	};
}
