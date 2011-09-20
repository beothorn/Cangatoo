function TestCollisionResolver(){
	
	this.testCollisionWithOneBoxStoppedFromUpperLeft = function(){
		var boxARectangle = {x:0,y:0,width:10,height:10};
		var boxATranslation = {x:10,y:10};
		var boxBRectangle = {x:11,y:1,width:10,height:10};
		var boxBTranslation = {x:0,y:0};
		
		var collisionResolver = new CollisionResolver();
		var beforeCollisionPosition = collisionResolver.getBeforeCollisionPositionFor(boxARectangle,boxATranslation,boxBRectangle,boxBTranslation);
	}
	
}