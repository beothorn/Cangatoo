function MainCharacter(){
	
	this.leftLimit = 52;
	this.topLimit = 32;
	this.rightLimit = 536;
	this.bottomLimit = 596;
	
	this.x=50;
	this.y=50;
	this.width = 50;
	this.height = 80;
	
	this.xAcceleration = 100;//PixelPerSecond
	this.yAcceleration = 450;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.xMaxSpeed = 500;
	this.yMaxSpeed = 1000;
	
	this.gravity = 800;
	this.xFriction = 500;
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

	this.getBottomX = function(){
		return this.x+(this.width/2);
	}
	
	this.getBottomY = function(){
		return this.y + this.height;
	}
	
	this.canJump = function(game){
		var firstPoint = game.isThereAnObjectOnPoint(this.x,this.y+this.height+1);
		var secondPoint = game.isThereAnObjectOnPoint(this.x+this.width,this.y+this.height+1);
		var onGround = this.y+this.height == this.bottomLimit;
		return firstPoint || secondPoint || onGround;
	}

	const NO_COLLISION = 0;
	const HORIZONTAL = 1;
	const VERTICAL = 2;

	this.isPointInside = function(px,py,rx,ry,rw,rh){
		if(px>rx+rw)
			return false;
		if(px<rx)
			return false;
		if(py>ry+rh)
			return false;
		if(py<ry)
			return false;
		return true;
	}

	this.collidesWith = function(otherElement){
		if(otherElement.x+otherElement.width<this.x)
			return NO_COLLISION;
		if(otherElement.x>this.x+this.width)
			return NO_COLLISION;
		if(otherElement.y+otherElement.height<this.y)
			return NO_COLLISION;
		if(otherElement.y>this.y+this.height)
		return NO_COLLISION;
		var leftTop = this.isPointInside(this.x,this.y,otherElement.x,otherElement.y,otherElement.width,otherElement.height);
		var rightTop = this.isPointInside(this.x+this.width,this.y,otherElement.x,otherElement.y,otherElement.width,otherElement.height);

		if(leftTop && rightTop)
			return VERTICAL;
		var leftBottom = this.isPointInside(this.x,this.y+this.height,otherElement.x,otherElement.y,otherElement.width,otherElement.height);
                var rightBottom = this.isPointInside(this.x+this.width,this.y+this.height,otherElement.x,otherElement.y,otherElement.width,otherElement.height);
		if(leftBottom && rightBottom)
                        return VERTICAL;
		if(leftBottom && leftTop)
			return HORIZONTAL;
		if(rightBottom && rightTop)
			return HORIZONTAL;
		
		return HORIZONTAL;//only one point collided
	}

	this.testCollisionWith = function(otherElement){
		var collisionResult = this.collidesWith(otherElement);
		if(collisionResult == NO_COLLISION)
			return;
		
		var normX = 0;
		var normY = 0;
		if(this.xSpeed != 0 || this.ySpeed != 0 ){
			var vectorLength = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
			normX = this.xSpeed / vectorLength;
			normY = this.ySpeed / vectorLength;
		}
	
		if(collisionResult == HORIZONTAL){
			normX = normX * -1;
		}
		if(collisionResult == VERTICAL){
			normY = normY * -1;
		}
	
		while(this.collidesWith(otherElement)){
			this.y+=normY;
			this.x+=normX;
		}
		//this.xSpeed = 0;
		//this.ySpeed = 0;
	}
	
	this.step = function(delta, gameCommandState, game){
		if(gameCommandState.left){
			if(this.xSpeed>0)
				this.xSpeed = 0;
			this.xSpeed-=this.xAcceleration;
		}
		if(gameCommandState.right){
			if(this.xSpeed<0)
                                this.xSpeed = 0;
			this.xSpeed+=this.xAcceleration;
		}
		if(!gameCommandState.left && !gameCommandState.right && this.canJump(game)){
			this.xSpeed = 0;
		}
		if(gameCommandState.up){
			var xFoot = this.x+(this.width/2);
			var yFoot = this.y + this.height+2;
			if(this.canJump(game))
				this.ySpeed-=this.yAcceleration;
		}
		if(gameCommandState.down){
			this.ySpeed+=this.yAcceleration;
		}
		
		this.limitSpeed();
		
		
		if(!this.canJump(game))
			this.ySpeed+=(delta*this.gravity)/1000;
		
		this.x+=(delta*this.xSpeed)/1000;
		this.y+=(delta*this.ySpeed)/1000;
		
		this.applyFriction(delta);
		this.wrapOnBoundaries();
		
		var xFoot = this.x+(this.width/2);
	  var yFoot = this.y + this.height+2;
		
	};
	
	this.draw = function(context){
		context.strokeRect(this.x, this.y, this.width, this.height);
		context.strokeRect(this.leftLimit, this.topLimit, this.rightLimit-this.leftLimit, this.bottomLimit-this.topLimit);
	};
}
