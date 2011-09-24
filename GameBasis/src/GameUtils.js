function applyGravity(element,gravity,delta){
	element.yAccelerate((delta*gravity)/1000);
}

function wrapOnBoundaries(element,topLimit,bottomLimit,rightLimit,leftLimit){
	if(element.x+element.width>element.rightLimit){
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
	if(element.x+element.width>element.rightLimit){
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
