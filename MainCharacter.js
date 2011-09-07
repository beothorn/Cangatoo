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
		
		this.ySpeed-=(delta*this.gravity)/1000;
		
		this.applyFriction(delta);
		this.wrapOnBoundaries();
	}
}

function MainCharacter(){
	
	var element = new Element(50,50);
	
	element.leftLimit = 52;
	element.topLimit = 32;
	element.rightLimit = 536;
	element.bottomLimit = 596;
	
	element.width = 50;
	element.height = 80;
	element.gravity = 800;
	
	element.setMaxXSpeed(500);
	element.setMaxYSpeed(1000);
	
	element.setXFriction(500);
	
	this.xAcceleration = 100;//PixelPerSecond
	this.yAcceleration = 450;

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

	this.collidesWith = function(otherElement){
		if(otherElement.x+otherElement.width<this.x)
			return false;
		if(otherElement.x>this.x+this.width)
			return false;
		if(otherElement.y+otherElement.height<this.y)
			return false;
		if(otherElement.y>this.y+this.height)
			return false;
		return true
	}

	this.testCollisionWith = function(otherElement){
		if(!this.collidesWith(otherElement))
			return;
		
		var normX = 0;
		var normY = 0;
		if(this.xSpeed != 0 || this.ySpeed != 0 ){
			var vectorLength = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
			normX = this.xSpeed / vectorLength;
			normY = this.ySpeed / vectorLength;
		}
	
		normX = normX * -1;
		normY = normY * -1;
	
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
