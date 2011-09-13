function Element(_x,_y){
	this.x=_x;
	this.y=_y;
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
			if(insideX<0)
				this.x+=1;
			
			this.x -= Math.round(insideX * this.elasticity);
			this.y += insideY;
			this.xSpeed = this.xSpeed * -1 * this.elasticity;
		}else{
			if(insideY>0)
				this.y-=1;
			if(insideY<0)
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
	
	this.getMoveThatResolvesCollision = function(element,movementLines,upSide,downSide,leftSide,rightSide,speedX,speedY){
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
					var insideX = Math.round(movementLines[i].x1 - intersectionLeft.x);
					var insideY = Math.round(movementLines[i].y1 - intersectionLeft.y);
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:true});
				}
			}
			
			if(speedX<=0){
				intersectionRight = lineIntersect(movementLines[i],rightSide);
				if(intersectionRight != null){
					var insideX = Math.round(movementLines[i].x1 - intersectionRight.x);
					var insideY = Math.round(movementLines[i].y1 - intersectionRight.y);
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:true});
				}
			}
			
			if(speedY>=0){
				intersectionUp = lineIntersect(movementLines[i],upSide);
				if(intersectionUp != null){
					var insideX = Math.round(movementLines[i].x1 - intersectionUp.x);
					var insideY = Math.round(movementLines[i].y1 - intersectionUp.y);
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:false});
				}
			}
			
			if(speedY<=0){
				intersectionDown = lineIntersect(movementLines[i],downSide);
				if(intersectionDown != null){
					var insideX = Math.round(movementLines[i].x1 - intersectionDown.x);
					var insideY = Math.round(movementLines[i].y1 - intersectionDown.y);
					insideRectangleMovement.push({x:insideX,y:insideY,bounceHor:false});
				}
			}
		}
		
		var otherRect = {x1:upSide.x1,y1:upSide.y1,x2:downSide.x2,y2:downSide.y2};
		
		for(i=0;i<insideRectangleMovement.length;i++){
			var insideRectangleMovementToCompare = insideRectangleMovement[i];
			var newX1 = element.x - insideRectangleMovementToCompare.x;
			var newY1 = element.y - insideRectangleMovementToCompare.y;
			
			if(insideRectangleMovementToCompare.bounceHor){
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
			
			var newX2 = newX1 + element.width;
			var newY2 = newY1 + element.height;
			
			var newRect = {x1:newX1,y1:newY1,x2:newX2,y2:newY2};
			
			if(!rectanglesIntersect(newRect,otherRect)){
				return insideRectangleMovementToCompare;
			}
		}
		
		return null;
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
		
		var roundSpeedX = Math.round(this.xLastDelta);
		var roundSpeedY = Math.round(this.yLastDelta);
		
		var topLeftMovement    = {x1: selfTopLeftX  ,y1: selfTopLeftY    ,x2: selfTopLeftX-roundSpeedX   ,y2: selfTopLeftY-roundSpeedY   };
		var topRightMovement   = {x1: selfTopRightX ,y1: selfTopLeftY    ,x2: selfTopRightX-roundSpeedX  ,y2: selfTopLeftY-roundSpeedY   };
		var bottomLeftMovement = {x1: selfTopLeftX  ,y1: selfBottomLeftY ,x2: selfTopLeftX-roundSpeedX   ,y2: selfBottomLeftY-roundSpeedY};
		var bottomRightMovement= {x1: selfTopRightX ,y1: selfBottomLeftY ,x2: selfTopRightX-roundSpeedX  ,y2: selfBottomLeftY-roundSpeedY};
		
		var movementLines = [topLeftMovement,topRightMovement,bottomLeftMovement,bottomRightMovement];
		
		var moveThatResolvesCollision = this.getMoveThatResolvesCollision(this,movementLines,otherElementUpSide,otherElementDownSide,otherElementLeftSide,otherElementRightSide,this.xSpeed,this.ySpeed);
		return moveThatResolvesCollision;
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
		
		var roundSpeedX = Math.round(this.xLastDelta) *-1;
		var roundSpeedY = Math.round(this.yLastDelta) *-1;
		
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
		
		var selfRectangle =  {x1: this.x ,y1: this.y ,x2: this.x+this.width ,y2: this.y+this.height};
		var otherRectangle = {x1: otherElement.x ,y1: otherElement.y ,x2: otherElement.x+otherElement.width ,y2: otherElement.y+otherElement.height};
		
		if(!rectanglesIntersect(selfRectangle,otherRectangle)){
			return;
		}
		
		var moveThatResolvesCollision = this.testSelfMovementLinesOnOther(otherElement,delta);
		if(moveThatResolvesCollision!=null){
			this.moveToIntersectionPointAndBounce(moveThatResolvesCollision.x,moveThatResolvesCollision.y,moveThatResolvesCollision.bounceHor);
			return;
		}
		moveThatResolvesCollision = this.testOtherMovementLinesOnSelf(otherElement,delta);
		if(moveThatResolvesCollision!=null){
			this.moveToIntersectionPointAndBounce(moveThatResolvesCollision.x*-1,moveThatResolvesCollision.y*-1,moveThatResolvesCollision.bounceHor);
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
		var oldX = this.x;
		var oldY = this.y;
		this.applyFriction(delta);
		
		this.x += Math.round(this.getXSpeedForDelta(delta));
		this.y += Math.round(this.getYSpeedForDelta(delta));
		
		this.ySpeed+=Math.round(this.getValueForDelta(this.gravity,delta));
		
		this.wrapOnBoundaries();
		this.xLastDelta = this.x - oldX;
		this.yLastDelta = this.y - oldY;
	}
}

function Game(drawCanvas){
	this.lastLoopTime = new Date().getTime();
	this.elements = new Array();

	this.canvas = drawCanvas;
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

	this.testCollisions = function(delta){
		for(var i=0;i<(this.elements.length-1);i++){
			 var element1 =this.elements[i];
			 for(var j=i+1;(j<this.elements.length);j++){
			 	 var element2 =this.elements[j];
				 element1.testCollisionWith(element2,delta);
			 }
		 }		
	}
	
	this.drawElements = function(delta){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i in this.elements)
		{
			this.elements[i].draw(this.context,delta);
		}
	}
	
	this.gameLoop = function(globalGameState){
		var currentTime = new Date().getTime();
		var delta = currentTime - this.lastLoopTime;
		if(delta>40)
			delta = 40;
		for (var i in this.elements)
		{
			this.elements[i].step(delta,globalGameState, this);
		}
		
		this.testCollisions(delta);
		this.drawElements(delta);
		this.lastLoopTime = new Date().getTime();
	}
}