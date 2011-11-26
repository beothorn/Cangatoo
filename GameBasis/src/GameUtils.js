function applyGravity(element,delta,gravity){
	element.yAccelerate((delta*gravity)/1000);
}

function wrapOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit){
	if(element.x+element.width>rightLimit){
		element.xSpeed = 0;
		element.x = rightLimit - element.width;
	}
	if(element.x<leftLimit){
		element.xSpeed = 0;
		element.x = leftLimit;
	}
	if(element.y+element.height>bottomLimit){
		element.ySpeed = 0;
		element.y = bottomLimit - element.height;
	}	
	if(element.y<topLimit){
		element.ySpeed = 0;
		element.y = topLimit;
	}
}

function bounceOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit){
	if(element.x+element.width>rightLimit){
		element.xSpeed = element.xSpeed *-1;
		element.x = rightLimit - element.width;
	}
	if(element.x<leftLimit){
		element.xSpeed = element.xSpeed *-1;
		element.x = leftLimit;
	}
	if(element.y+element.height>bottomLimit){
		element.ySpeed = element.ySpeed *-1;
		element.y = bottomLimit - element.height;
	}	
	if(element.y<topLimit){
		element.ySpeed = element.ySpeed *-1;
		element.y = topLimit;
	}
}

function applyFriction(element,delta,xFriction,yFriction){
	if(element.xSpeed>0){
		element.xSpeed-=element.getValueForDelta(xFriction,delta);
		if(element.xSpeed<0)
			element.xSpeed=0;
	}
	if(element.xSpeed<0){
		element.xSpeed+=element.getValueForDelta(xFriction,delta);
		if(element.xSpeed>0)
			element.xSpeed=0;
	}
	if(element.ySpeed>0){
		element.ySpeed-=element.getValueForDelta(yFriction,delta);
		if(element.ySpeed<0)
			element.ySpeed=0;
	}
	if(element.ySpeed<0){
		element.ySpeed+=element.getValueForDelta(yFriction,delta);
		if(element.ySpeed>0)
			element.ySpeed=0;
	}
}

function goToLevel(levelName){
	game.loadLevel(levelName);
}

function goToNextLevel(){
	game.goToNextLevel();
}

function goToPreviousLevel(){
	game.goToPreviousLevel();
}
